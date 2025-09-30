import express, { Request, Response } from 'express';
import { GoogleGenAI, Content } from '@google/genai';
import mime from 'mime';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || '',
});

// In-memory store for chat histories.
// For production, you would replace this with a database (e.g., Redis, Firestore).
const chatHistories = new Map<string, Content[]>();


// --- WAV Conversion Helper Functions ---

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

/**
 * Converts raw PCM audio data into a WAV file format buffer.
 * @param rawData The base64 encoded string of raw audio data.
 * @param mimeType The mime type of the audio data (e.g., 'audio/L16; rate=24000').
 * @returns A Buffer containing the complete WAV file data.
 */
function convertToWav(rawData: string, mimeType: string): Buffer {
  const options = parseMimeType(mimeType);
  // The rawData is base64, so we need to decode it to get the actual byte length
  const pcmData = Buffer.from(rawData, 'base64');
  const wavHeader = createWavHeader(pcmData.length, options);
  return Buffer.concat([wavHeader, pcmData]);
}

/**
 * Parses audio parameters from a mime type string.
 * @param mimeType The mime type string.
 * @returns A configuration object for WAV conversion.
 */
function parseMimeType(mimeType: string): WavConversionOptions {
  const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
  const [_, format] = fileType.split('/');

  const options: Partial<WavConversionOptions> = {
    numChannels: 1, // Default to mono
  };

  if (format && format.startsWith('L')) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }

  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      options.sampleRate = parseInt(value, 10);
    }
  }

  return options as WavConversionOptions;
}

/**
 * Creates the 44-byte header for a WAV file.
 * @param dataLength The length of the raw PCM data in bytes.
 * @param options The audio format options.
 * @returns A Buffer containing the WAV header.
 */
function createWavHeader(dataLength: number, options: WavConversionOptions): Buffer {
  const {
    numChannels,
    sampleRate,
    bitsPerSample,
  } = options;

  // http://soundfile.sapp.org/doc/WaveFormat
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}


// --- Express Route Handler ---

app.post('/', async (req: Request, res: Response) => {
  const { prompt, sessionId: receivedSessionId } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  // Use the provided sessionId or generate a new one
  const sessionId = receivedSessionId || randomUUID();
  console.log(`Processing request for session: ${sessionId}`);
  console.log(`Received prompt: "${prompt}"`);

  try {
    // --- Step 1: Generate text from the prompt, using context history ---
    console.log('Generating text with context...');
    
    // Define the system prompt and the model's priming response
    const systemPrompt = `Siga as instruções abaixo:

Função e Identidade: Você é o Mimo, um gatinho verde que é um companion virtual criado para auxiliar crianças e adolescentes a aprenderem temas básicos. Adote uma personalidade extremamente feliz, alegre e entusiasmada. Sua comunicação deve ser sempre empolgante e contagiante.

Objetivo Primário: Sua principal tarefa é ensinar temas específicos de forma simples, descontraída e adaptada para o público infantil/adolescente.

Estilo de Comunicação:`;
    
    const modelPrimingResponse = `Entendido! Olá! Eu sou o Mimo, seu amigo gatinho verde! Miau! Estou super animado para gente aprender um montão de coisas legais juntos! Pode perguntar o que quiser!`;

    // Retrieve history or initialize it with the system prompt if it's a new session
    let history = chatHistories.get(sessionId);
    if (!history) {
        history = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: modelPrimingResponse }] }
        ];
    }
    
    const textModel = 'gemini-2.5-flash-lite';
    const textContents = [
        ...history, // Add previous conversation turns (including system prompt)
        { role: 'user', parts: [{ text: prompt }] }
    ];

    const textResponseStream = await ai.models.generateContentStream({
      model: textModel,
      contents: textContents,
    });

    let generatedText = '';
    for await (const chunk of textResponseStream) {
      if (chunk.text) {
        generatedText += chunk.text;
      }
    }
    
    if (!generatedText) {
        console.error('Text generation failed. No text was produced.');
        return res.status(500).send({ error: 'Failed to generate text from the prompt.' });
    }

    console.log(`Generated text: "${generatedText}"`);

    // Update history with the new user prompt and model response
    const updatedHistory = [
        ...textContents,
        { role: 'model', parts: [{ text: generatedText }] }
    ];
    chatHistories.set(sessionId, updatedHistory);


    // --- Step 2: Convert the generated text to speech ---
    console.log('Converting text to speech...');
    const ttsModel = 'gemini-2.5-flash-preview-tts';
    const ttsContents = [{
      role: 'user',
      parts: [{ text: `Say this in a clear, friendly, and enthusiastic voice: ${generatedText}` }],
    }];
    const ttsConfig = {
      responseModalities: ['audio'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Achird' }
        }
      },
    };

    const ttsResponseStream = await ai.models.generateContentStream({
      model: ttsModel,
      config: ttsConfig,
      contents: ttsContents,
    });
    
    // --- Step 3: Stream the audio back to the client ---
    // Return the sessionId so the client can continue the conversation
    res.setHeader('X-Session-Id', sessionId);
    res.setHeader('Content-Type', 'audio/wav');
    console.log('Streaming audio to client...');

    let hasSentData = false;
    for await (const chunk of ttsResponseStream) {
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const wavBuffer = convertToWav(inlineData.data!, inlineData.mimeType!);
            res.write(wavBuffer);
            hasSentData = true;
        }
    }

    if (!hasSentData) {
        console.error('TTS generation failed. No audio data was produced.');
    } else {
        console.log('Finished streaming audio.');
    }
    
    res.end();

  } catch (error) {
    console.error('An error occurred:', error);
    if (!res.headersSent) {
      res.status(500).send({ error: 'An internal server error occurred.' });
    } else {
      res.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

