import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import TarefaDetalhes from '../pages/TarefaDetalhes';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/tarefas/:id" element={<TarefaDetalhes />} />
    </Routes>
  );
}

export default Router;