import Tarefa from "../../components/Tarefa";

function Home() {
  // Lista de tarefas de exemplo
  const tarefas = [
    {
      id: 1,
      titulo: "Implementar Dashboard",
      descricao: "Criar um dashboard interativo com gráficos e métricas importantes para o usuário visualizar seus dados."
    },
    {
      id: 2,
      titulo: "Configurar Autenticação",
      descricao: "Implementar sistema de login e registro de usuários com validação de segurança e recuperação de senha."
    },
    {
      id: 3,
      titulo: "Design Responsivo",
      descricao: "Ajustar todas as telas para funcionar perfeitamente em dispositivos móveis e desktop."
    },
    {
      id: 4,
      titulo: "Integração com API",
      descricao: "Conectar o frontend com os serviços backend para sincronização de dados em tempo real."
    },
    {
      id: 5,
      titulo: "Testes Automatizados",
      descricao: "Desenvolver suite de testes unitários e de integração para garantir qualidade do código."
    },
    {
      id: 6,
      titulo: "Otimização de Performance",
      descricao: "Melhorar o tempo de carregamento e responsividade da aplicação através de técnicas de otimização."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindaro via-light-green to-emerald">
      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-12 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-dye mb-4">
            Minhas Tarefas
          </h1>
          <p className="text-lg text-verdigris max-w-2xl mx-auto">
            Organize e acompanhe o progresso dos seus projetos de forma eficiente
          </p>
        </div>

        {/* Grid de tarefas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tarefas.map((tarefa) => (
            <Tarefa
              key={tarefa.id}
              id={tarefa.id}
              titulo={tarefa.titulo}
              descricao={tarefa.descricao}
            />
          ))}
        </div>
      </main>

      {/* Footer fixo */}
      <footer className="fixed bottom-0 left-0 right-0 bg-indigo-dye text-white py-4 shadow-lg">
        <div className="text-center">
          <p className="text-sm">
            Feito com <span className="text-red-400 text-lg">♥</span> por{" "}
            <span className="font-semibold text-keppel">Barões do vibe coding</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
