import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';
import { TodoProvider } from './components/TodoContext';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodoProvider>
      <App />
    </TodoProvider>,
  );
