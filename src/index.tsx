import { createRoot } from 'react-dom/client';
import { TodoContextProvider } from './context/TodoContext';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodoContextProvider>
      <App />
    </TodoContextProvider>,
  );
