import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';
import { App } from './App';
import { TodoContext } from './TodoContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodoContext>
    <App />
  </TodoContext>,
);
