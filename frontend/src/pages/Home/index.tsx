import { useState, useEffect } from "react";
import Tarefa from "../../components/Tarefa";
import MimoFace from "../../assets/face.svg"

function Home() {
  // Estados para controlar a animação
  const [isAnimating, setIsAnimating] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Controla a sequência da animação
  useEffect(() => {
    // Primeira fase: MimoFace grande no centro (1.5s)
    const timer1 = setTimeout(() => {
      setIsAnimating(false); // Inicia a animação para posição final
    }, 1500);

    // Segunda fase: Mostra o resto do conteúdo (2.5s total)
    const timer2 = setTimeout(() => {
      setShowContent(true);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-mindaro via-light-green to-emerald relative overflow-hidden">
      {/* Animação de entrada - MimoFace */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-in-out ${
          isAnimating 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0 pointer-events-none'
        }`}
      >
        <img 
          src={MimoFace} 
          alt="Mimo Face" 
          className="w-80 h-80 md:w-96 md:h-96 animate-soft-pulse"
        />
      </div>

      {/* MimoFace na posição final */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isAnimating 
            ? 'opacity-0 scale-0' 
            : 'opacity-100 scale-100'
        }`}
      >
        <main className="container mx-auto px-6 py-12 pb-24">
          <img 
            src={MimoFace} 
            alt="Mimo Face" 
            className="w-64 h-64 mx-auto animate-bounce-scale"
          />
          
          {/* Conteúdo da página */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              showContent 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
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
              {tarefas.map((tarefa, index) => (
                <div
                  key={tarefa.id}
                  className={`transition-all duration-700 ${
                    showContent 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ 
                    transitionDelay: `${800 + (index * 100)}ms` 
                  }}
                >
                  <Tarefa
                    id={tarefa.id}
                    titulo={tarefa.titulo}
                    descricao={tarefa.descricao}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer fixo */}
      <footer 
        className={`fixed bottom-0 left-0 right-0 bg-indigo-dye text-white py-4 shadow-lg transition-all duration-1000 delay-1000 ${
          showContent 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-full'
        }`}
      >
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
