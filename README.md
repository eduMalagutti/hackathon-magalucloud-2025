# Mimo - Seu Companheiro de Estudos com IA 

Projeto desenvolvido para o **Hackathon Magalu Cloud 2025: UFSCAR**

Disponível em: http://201.23.73.1

Vídeo: https://drive.google.com/file/d/1l-APNuv3kldCOuH61UfUm2uWSDQdSerQ/view?usp=sharing

## 🎯 O Problema

Manter o foco nos estudos é um dos principais desafios enfrentados por estudantes no Brasil. O uso de dispositivos digitais em sala de aula, por exemplo, é apontado como um dos maiores fatores de distração. De acordo com o relatório do PISA 2022, oito em cada dez estudantes brasileiros de 15 anos afirmaram se distrair com o celular durante as aulas, um dos índices mais altos do mundo.

Além da distração, a procrastinação também aparece como um fenômeno massivo entre os estudantes brasileiros. Estima-se que entre 80% e 95% dos universitários procrastinam em suas atividades acadêmicas.

Esses dados demonstram que manter a disciplina, a concentração e o engajamento nos estudos não é apenas uma questão individual, mas um problema real e generalizado no Brasil, que demanda soluções inovadoras e eficazes.

## 💡 A Solução: Apresentando o Mimo!

**Mimo** é um companheiro virtual com Inteligência Artificial, representado por um simpático gatinho verde, criado para auxiliar crianças e adolescentes a aprenderem temas básicos de forma simples, descontraída e, acima de tudo, divertida.

Com uma personalidade extremamente feliz, alegre e entusiasmada, Mimo transforma o aprendizado em uma aventura contagiante, ajudando a combater a procrastinação e a manter os estudantes engajados.

## ✨ Funcionalidades Principais

- **Frontend Interativo:** Uma interface moderna e acolhedora construída com React, apresentando tarefas de aprendizado claras e um ambiente de conversação imersivo.
- **Companheiro com IA (Mimo):** Um personagem virtual, "Mimo", que utiliza o poder do Google Gemini para interagir, ensinar e motivar os estudantes.
- **Conversa por Voz (Text-to-Speech):** O backend converte as respostas de texto do Mimo em áudio (formato WAV), proporcionando uma experiência de conversação mais natural e acessível.
- **Reconhecimento de Voz (Speech-to-Text):** O frontend permite que o usuário envie mensagens para o Mimo usando a própria voz, tornando a interação mais dinâmica.
- **Gerenciamento de Contexto:** A aplicação mantém o histórico da conversa, permitindo um diálogo contínuo e coerente com o Mimo.

## 🚀 Tecnologias Utilizadas

O projeto é uma aplicação full-stack que combina um frontend moderno com um backend robusto focado em IA.

### Frontend
- **Framework:** React com Vite
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router

### Backend
- **Plataforma:** Node.js com Express
- **Linguagem:** TypeScript
- **IA e TTS:** Google Gemini API
  - **Modelo de Texto:** `gemini-2.5-flash-lite`
  - **Modelo de Voz:** `gemini-2.5-flash-preview-tts`

## ☁️ Deploy na Magalu Cloud

O backend do Mimo foi hospedado utilizando produtos da **Magalu Cloud**, através do deploy em uma **Virtual Machine**. Isso permitiu que a aplicação ficasse acessível publicamente e com infraestrutura escalável para testes e demonstrações do projeto.

## 🏃 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento localmente.

### Pré-requisitos
- **Node.js:** Versão 18 ou superior
- **npm:** (gerenciador de pacotes do Node.js)
- **Chave de API do Google Gemini:** Necessária para o funcionamento do backend.

### Backend (`backend-node`)

1. **Navegue até a pasta do backend:**
   ```bash
   cd backend-node

2. **Crie o arquivo de ambiente:**
   Crie um arquivo chamado `.env` na raiz da pasta `backend-node` e adicione sua chave da API do Gemini:

   ```
   GEMINI_API_KEY="SUA_CHAVE_DE_API_AQUI"
   ```
3. **Instale as dependências:**

   ```bash
   npm install
   ```
4. **Inicie o servidor:**

   ```bash
   npm start
   ```

   O servidor backend estará em execução em `http://localhost:3000`.

### Frontend (`frontend`)

1. **Navegue até a pasta do frontend (em um novo terminal):**

   ```bash
   cd frontend
   ```
2. **Instale as dependências:**

   ```bash
   npm install
   ```
3. **Inicie a aplicação:**

   ```bash
   npm run dev
   ```

   A aplicação estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 👨‍💻 Equipe

Feito com <span style="color: #e25555;">♥</span> por **Barões do Vibe Coding**:

* [Eduardo Souza Malagutti](https://github.com/eduMalagutti) – responsável pelo backend e integração com a IA.
* [Gabriel Fernandes Menoni](https://github.com/gabrielmenoni) – responsável pelo frontend e interface interativa.
