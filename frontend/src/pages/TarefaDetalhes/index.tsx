import { useState } from 'react';
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

  // Pegar dados da tarefa do state da navegação ou usar fallback
  const tarefaData = location.state as TarefaData;
  const tituloTarefa = tarefaData?.titulo || `Tarefa #${id}`;

  const handleVoltar = () => {
    navigate('/');
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

      // Fazer a requisição POST para a rota '/'
      const response = await api.post('/', payload);
      
      // Se recebeu um sessionId na resposta, salvar no localStorage
      if (response.data.sessionId) {
        localStorage.setItem('sessionId', response.data.sessionId);
      }
      
      console.log('Resposta da API:', response.data);
      
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarefaDetalhes;