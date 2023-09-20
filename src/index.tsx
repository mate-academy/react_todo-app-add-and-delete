import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodoContextProvider } from './components/TodoContext';
import { ErrorContextProvider } from './components/ErrorContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <ErrorContextProvider>
      <TodoContextProvider>
        <App />
      </TodoContextProvider>
    </ErrorContextProvider>,
  );
