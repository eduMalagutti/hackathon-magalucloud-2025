import { useNavigate } from 'react-router-dom';

interface TarefaProps {
  id: number;
  titulo: string;
  descricao: string;
}

function Tarefa({ id, titulo, descricao }: TarefaProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tarefas/${id}`, {
      state: {
        id,
        titulo,
        descricao
      }
    });
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-keppel hover:shadow-lg task-card-hover smooth-transition cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-indigo-dye mb-3">
        {titulo}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {descricao}
      </p>
    </div>
  );
}

export default Tarefa;