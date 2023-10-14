import { createRoot } from 'react-dom/client';

import './styles/minireset.sass';
import './styles/todo-list.scss';
import './styles/todoapp.scss';
import './styles/todo.scss';
import './styles/filter.scss';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './components/TodoContext';

const container = document.getElementById('root') as HTMLDivElement;

createRoot(container).render(
  <TodosProvider>
    <App />
  </TodosProvider>,
);
