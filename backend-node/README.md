Aplicativo Express Conversacional de Texto para Fala com Gemini
Este é um aplicativo Node.js construído com Express e TypeScript que usa a API do Google Gemini para criar um agente conversacional. Ele pode:

Lembrar o contexto de uma conversa usando um sessionId.

Gerar uma resposta de texto contextual a partir de um prompt fornecido pelo usuário usando o modelo gemini-2.5-flash-lite.

Converter o texto gerado em fala usando o modelo gemini-2.5-flash-preview-tts.

Transmitir o áudio resultante de volta para o cliente como um arquivo WAV.

Pré-requisitos
Node.js (v18 ou posterior recomendado)

npm (ou yarn/pnpm)

Uma chave de API do Google Gemini.

Configuração
Clone o repositório ou salve os arquivos:
Certifique-se de ter package.json, .env, server.ts e README.md no mesmo diretório.

Defina sua chave de API:
Abra o arquivo .env e substitua "YOUR_API_KEY" pela sua chave de API real do Gemini.

Instale as dependências:
Abra seu terminal no diretório do projeto e execute:

npm install

Executando a Aplicação
Para iniciar o servidor em modo de desenvolvimento usando ts-node, execute:

npm start

O servidor será iniciado em http://localhost:3000.

Como Usar
Você pode enviar uma requisição POST para o endpoint raiz (/) com um corpo JSON contendo um prompt e um sessionId opcional.

Iniciando uma Nova Conversa
Para iniciar uma nova conversa, basta enviar um prompt. O servidor irá gerar um novo ID de sessão e retorná-lo no cabeçalho de resposta X-Session-Id.

Exemplo usando curl:
A flag -v é usada para visualizar os cabeçalhos de resposta, para que possamos ver o X-Session-Id.

# Primeira mensagem na conversa
curl -v -X POST http://localhost:3000/ \
-H "Content-Type: application/json" \
-d '{"prompt": "Meu nome é Alex. Qual é o seu nome?"}' \
-o response1.wav

Procure por um cabeçalho como < X-Session-Id: a1b2c3d4-e5f6-.... na saída. Você usará este ID para a próxima requisição.

Continuando uma Conversa
Para continuar a conversa, inclua o sessionId que você recebeu da requisição anterior no corpo JSON.

Exemplo usando curl:
Substitua SEU_ID_DE_SESSAO_AQUI pelo ID do passo anterior.

# Mensagem de continuação
curl -X POST http://localhost:3000/ \
-H "Content-Type: application/json" \
-d '{"prompt": "Você se lembra do meu nome?", "sessionId": "SEU_ID_DE_SESSAO_AQUI"}' \
-o response2.wav

A IA agora deve se lembrar que seu nome é Alex e responder de acordo. Você pode tocar os arquivos response1.wav e response2.wav para ouvir a conversa.