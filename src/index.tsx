import { createRoot } from 'react-dom/client';
import { TodosProvider } from './components/TodoContext';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodosProvider>
    <App />
  </TodosProvider>,
);
