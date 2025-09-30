/*
 * TarefaDetalhes - Página de chat com reprodução de áudio
 * 
 * Funcionalidades implementadas:
 * 1. Reprodução automática de arquivos de áudio WAV recebidos da API
 * 2. Gerenciamento de sessão através de sessionId
 * 3. Controles de reprodução (parar áudio, repetir áudio anterior)
 * 4. Indicadores visuais de status (gravando, enviando, reproduzindo)
 * 5. Verificação de suporte a áudio no navegador
 * 6. Limpeza automática de recursos de áudio
 * 7. Tratamento de erros robusto
 * 8. Armazenamento e reprodução do último áudio recebido
 * 
 * A API retorna arquivos de áudio em formato WAV que são automaticamente
 * reproduzidos quando recebidos. O sessionId é gerenciado via cabeçalho
 * HTTP X-Session-Id para manter o contexto da conversa.
 * 
 * O último áudio recebido fica armazenado em memória e pode ser reproduzido
 * novamente através do botão de repetir.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../../assets/Gemini_Generated_Image_646qf0646qf0646q.png';
import api from '../../services/api';

interface TarefaData {
  id: number;
  titulo: string;
  descricao: string;
}

function TarefaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mensagem, setMensagem] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);

  // Pegar dados da tarefa do state da navegação ou usar fallback
  const tarefaData = location.state as TarefaData;
  const tituloTarefa = tarefaData?.titulo || `Tarefa #${id}`;

  // Limpar áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlayingAudio(false);
      }
      setLastAudioBlob(null);
    };
  }, [currentAudio]);

  // Verificar suporte a áudio no navegador
  const checkAudioSupport = () => {
    const audio = document.createElement('audio');
    return !!(audio.canPlayType && audio.canPlayType('audio/wav').replace(/no/, ''));
  };

  // Função para repetir o último áudio
  const handleRepeatAudio = async () => {
    if (!lastAudioBlob) {
      alert('Nenhum áudio anterior disponível para repetir.');
      return;
    }
    
    if (isPlayingAudio) {
      alert('Aguarde o áudio atual terminar antes de repetir.');
      return;
    }
    
    await playAudio();
  };

  const handleVoltar = () => {
    // Parar áudio se estiver tocando
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlayingAudio(false);
    }
    // Limpar áudio anterior armazenado
    setLastAudioBlob(null);
    navigate('/');
  };

  const playAudio = async (audioBlob?: Blob) => {
    try {
      // Se não foi fornecido um blob, usar o último áudio armazenado
      const blobToPlay = audioBlob || lastAudioBlob;
      
      if (!blobToPlay) {
        alert('Nenhum áudio anterior disponível para repetir.');
        return;
      }

      // Verificar se o navegador suporta áudio WAV
      if (!checkAudioSupport()) {
        alert('Seu navegador não suporta reprodução de áudio WAV. Tente usar um navegador mais recente.');
        return;
      }

      // Parar áudio anterior se existir
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      // Se foi fornecido um novo áudio, armazená-lo
      if (audioBlob) {
        setLastAudioBlob(audioBlob);
      }

      console.log('Reproduzindo áudio:', {
        size: blobToPlay.size,
        type: blobToPlay.type,
        isRepeat: !audioBlob
      });

      // Criar URL do blob
      const audioUrl = URL.createObjectURL(blobToPlay);
      
      // Criar elemento de áudio
      const audio = new Audio(audioUrl);
      
      // Configurar eventos do áudio
      audio.addEventListener('loadstart', () => {
        console.log('Carregamento do áudio iniciado');
        setIsPlayingAudio(true);
      });

      audio.addEventListener('loadeddata', () => {
        console.log('Dados do áudio carregados');
      });

      audio.addEventListener('canplay', () => {
        console.log('Áudio pronto para reprodução');
      });
      
      audio.addEventListener('ended', () => {
        console.log('Reprodução do áudio finalizada');
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Erro ao reproduzir áudio:', e);
        console.error('Detalhes do erro:', {
          error: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState
        });
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        alert('Erro ao reproduzir áudio. Verifique se o arquivo está correto.');
      });

      // Armazenar referência do áudio
      setCurrentAudio(audio);
      
      // Reproduzir áudio
      await audio.play();
      console.log('Reprodução iniciada com sucesso');
      
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setIsPlayingAudio(false);
      setCurrentAudio(null);
      alert('Erro ao reproduzir áudio. Tente novamente.');
    }
  };

  const handleEnviarMensagem = async () => {
    if (!mensagem.trim()) return;

    setIsLoading(true);
    
    try {
      // Verificar se há sessionId no localStorage
      const sessionId = localStorage.getItem('sessionId');
      
      // Preparar o payload
      const payload = {
        prompt: mensagem.trim(),
        sessionId: sessionId || null
      };

      // Fazer a requisição POST para a rota '/' com responseType 'blob' para receber áudio
      const response = await api.post('/', payload, {
        responseType: 'blob', // Importante para receber arquivo binário
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/wav, audio/*' // Aceitar áudio
        }
      });

      console.log('Resposta da API:', response);
      
      // Capturar sessionId do cabeçalho da resposta
      const responseSessionId = response.headers['x-session-id'];
      if (responseSessionId) {
        localStorage.setItem('sessionId', responseSessionId);
        console.log('SessionId salvo:', responseSessionId);
      }
      
      // Verificar se a resposta é um áudio
      const contentType = response.headers['content-type'] || '';
      
      if (contentType.startsWith('audio/') && response.data instanceof Blob) {
        // É um arquivo de áudio
        console.log('Recebido arquivo de áudio WAV, reproduzindo...');
        await playAudio(response.data);
      } else {
        console.warn('Resposta não é um arquivo de áudio válido');
        alert('Resposta recebida não é um áudio válido.');
      }
      
      // Limpar o campo de mensagem após envio bem-sucedido
      setMensagem('');
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Aqui você pode implementar uma notificação de erro para o usuário
      alert('Erro ao enviar mensagem. Tente novamente.');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleVoiceCapture = () => {
    // Verificar se o navegador suporta Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz. Tente usar Chrome ou Edge.');
      return;
    }

    // Criar instância do reconhecimento de voz
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    const recognition = new SpeechRecognition();

    // Configurações do reconhecimento
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Começar a escutar
    setIsListening(true);
    recognition.start();

    // Quando obtiver resultado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Texto capturado da voz:', transcript);
      
      // Adicionar o texto capturado ao campo de mensagem
      setMensagem(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    // Quando houver erro
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Permissão de microfone negada. Por favor, permita o acesso ao microfone.');
      } else if (event.error === 'no-speech') {
        alert('Nenhuma fala detectada. Tente novamente.');
      } else {
        alert('Erro no reconhecimento de voz. Tente novamente.');
      }
    };

    // Quando terminar
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      {/* Header da conversa */}
      <div className="bg-indigo-dye text-white p-6 md:p-6 shadow-lg flex-shrink-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Botão de voltar */}
            <button 
              onClick={handleVoltar}
              className="flex items-center gap-2 md:gap-2 bg-keppel hover:bg-verdigris text-white px-3 md:px-4 py-3 md:py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-base md:text-base"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 md:h-5 md:w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              <span className="hidden sm:inline">Voltar</span>
            </button>

            {/* Título centralizado */}
            <div className="text-center flex-1 px-2">
              <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-2">{tituloTarefa}</h1>
              <p className="text-keppel text-base md:text-lg hidden sm:block">Assistente virtual para sua tarefa</p>
            </div>

            {/* Espaço para balancear o layout */}
            <div className="w-16 md:w-24"></div>
          </div>
        </div>
      </div>

      {/* Imagem de fundo decorativa - ocupa espaço restante */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div 
          className="w-full h-full max-w-screen-xl bg-contain bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            maxWidth: '1200px',
            aspectRatio: '1/1',
            maxHeight: 'calc(100vh - 200px)'
          }}
        >
        </div>
      </div>

      {/* Área do chat simplificada - FIXO NA PARTE INFERIOR */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald to-keppel backdrop-blur-sm shadow-2xl p-4 md:p-4 flex-shrink-0">
        <div className="container mx-auto max-w-4xl">
          {/* Card do chat */}
          <div className="bg-transparent">
            {/* Input do chat */}
            <div className="bg-emerald/20 backdrop-blur-sm rounded-xl p-4 md:p-4 shadow-lg">
              <div className="flex items-end gap-3 md:gap-4">
                {/* Textarea para mensagem */}
                <div className="flex-1">
                  <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder={isLoading ? "Enviando mensagem..." : "Digite sua mensagem aqui..."}
                    className="w-full p-3 md:p-3 border-2 border-white/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 bg-white/90 text-base md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={2}
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-2 flex-col md:gap-2">
                  {/* Botão de repetir áudio */}
                  <button 
                    onClick={handleRepeatAudio}
                    disabled={isLoading || isPlayingAudio || !lastAudioBlob}
                    className="bg-white/90 hover:bg-white text-emerald p-3 md:p-3 rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:opacity-50"
                    title={!lastAudioBlob ? 'Nenhum áudio para repetir' : isPlayingAudio ? 'Áudio reproduzindo...' : isLoading ? 'Enviando...' : 'Repetir último áudio'}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 md:h-5 md:w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                      />
                    </svg>
                  </button>

                  {/* Botão de microfone */}
                  <button 
                    onClick={handleVoiceCapture}
                    disabled={isListening || isLoading}
                    className={`${
                      isListening 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-white/90 hover:bg-white text-emerald'
                    } p-3 md:p-3 rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:opacity-50`}
                    title={isListening ? 'Gravando...' : isLoading ? 'Enviando...' : 'Clique para gravar voz'}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 md:h-5 md:w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                      />
                    </svg>
                  </button>

                    {/* Botão de enviar */}
                    <button 
                    onClick={handleEnviarMensagem}
                    disabled={!mensagem.trim() || isLoading}
                    className="bg-white/90 hover:bg-white text-emerald p-3 md:p-3 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    title={isLoading ? "Enviando..." : "Enviar mensagem"}
                    >
                    {isLoading ? (
                      // Spinner de loading
                      <div className="w-5 h-5 border-2 border-emerald border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 md:h-5 md:w-5 rotate-90" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                        />
                      </svg>
                    )}
                    </button>
                </div>
              </div>

              {/* Status de gravação */}
              {isListening && (
                <div className="mt-3 md:mt-3 text-center">
                  <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 md:px-4 py-2 md:py-2 rounded-full text-sm md:text-sm font-medium">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Gravando... Fale agora
                  </span>
                </div>
              )}

              {/* Status de envio */}
              {isLoading && (
                <div className="mt-3 md:mt-3 text-center">
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 md:px-4 py-2 md:py-2 rounded-full text-sm md:text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Enviando mensagem...
                  </span>
                </div>
              )}

              {/* Status de reprodução de áudio */}
              {isPlayingAudio && (
                <div className="mt-3 md:mt-3 text-center">
                  <div className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 md:px-4 py-2 md:py-2 rounded-full text-sm md:text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Reproduzindo áudio...
                    </span>
                    <button
                      onClick={() => {
                        if (currentAudio) {
                          currentAudio.pause();
                          setCurrentAudio(null);
                          setIsPlayingAudio(false);
                        }
                      }}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                    >
                      Parar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarefaDetalhes;