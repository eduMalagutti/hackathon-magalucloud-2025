import { useState } from 'react';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../assets/Gemini_Generated_Image_646qf0646qf0646q.png';

function TarefaDetalhes() {
  const { id } = useParams();
  const [mensagem, setMensagem] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleEnviarMensagem = () => {
    if (mensagem.trim()) {
      // Lógica para enviar mensagem será implementada depois
      console.log('Mensagem enviada:', mensagem);
      setMensagem('');
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
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header da conversa */}
        <div className="bg-indigo-dye bg-opacity-90 text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Tarefa #{id}</h1>
            <p className="text-keppel">Chat de suporte para sua tarefa</p>
          </div>
        </div>

        {/* Área do chat */}
        <div className="flex-1 container mx-auto p-4 flex flex-col justify-end">
          {/* Mensagens do chat - área vazia por enquanto */}
          <div className="flex-1 mb-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-white">
              <p className="text-center text-lg">
                👋 Olá! Como posso ajudá-lo com esta tarefa?
              </p>
            </div>
          </div>

          {/* Input do chat */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-end gap-3">
              {/* Textarea para mensagem */}
              <div className="flex-1">
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-keppel focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-2">
                {/* Botão de microfone */}
                <button 
                  onClick={handleVoiceCapture}
                  disabled={isListening}
                  className={`${isListening ? 'bg-red-500 animate-pulse' : 'bg-cerulean hover:bg-lapis-lazuli'} text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
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
                  className="bg-keppel hover:bg-verdigris text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarefaDetalhes;