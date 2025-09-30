import Tarefa from "../../components/Tarefa";
import MimoFace from "../../assets/face.svg"

function Home() {
  // Lista de tarefas de exemplo
  const tarefas = [
    {
      id: 1,
      titulo: "Aprender as Cores",
      descricao: "Vamos descobrir e aprender sobre as cores primárias e secundárias através de jogos divertidos e atividades coloridas!"
    },
    {
      id: 2,
      titulo: "Contar até 10",
      descricao: "Aprenda a contar de 1 até 10 com músicas, brincadeiras e exercícios divertidos que tornam a matemática fácil e legal!"
    },
    {
      id: 3,
      titulo: "Alfabeto Divertido",
      descricao: "Conheça todas as letras do alfabeto através de histórias, canções e jogos que ajudam a memorizar cada letrinha!"
    },
    {
      id: 4,
      titulo: "Formas Geométricas",
      descricao: "Descubra círculos, quadrados, triângulos e outras formas geométricas através de atividades lúdicas e criativas!"
    },
    {
      id: 5,
      titulo: "Animais da Fazenda",
      descricao: "Conheça os animais da fazenda, seus sons e características através de histórias interativas e brincadeiras educativas!"
    },
    {
      id: 6,
      titulo: "Dias da Semana",
      descricao: "Aprenda os dias da semana de forma divertida com músicas, calendários coloridos e atividades do dia a dia!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindaro via-light-green to-emerald">
      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-12 pb-24">
        <img src={MimoFace} alt="Mimo Face" className="w-64 h-64 mx-auto" />
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-dye mb-4 drop-shadow-lg shadow-white/50">
            Bem vindo ao Mimo ♥
            </h1>
          <p className="text-lg text-black max-w-2xl mx-auto mt-5">
            Selecione uma tarefa abaixo para que o Mimo possa te ajudar a aprender!
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
