import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { TodoProvider } from './store/TodoContext';
import { ErrorProvider } from './store/ErrorContext';
import { LoadingProvider } from './store/LoadingContext';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodoProvider>
    <LoadingProvider>
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </LoadingProvider>
  </TodoProvider>,
);
