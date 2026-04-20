import { createRoot } from 'react-dom/client';
import { TodoProvider } from './context/TodoContext';
import { App } from './App';
import './styles/index.scss'; // ou seu caminho de estilos
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <TodoProvider>
      <App />
    </TodoProvider>,
  );
}
