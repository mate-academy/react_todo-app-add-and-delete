import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodoContextProvider } from './context/todoContext/todoContextProvider';
import {
  ErrorContextProvider,
} from './context/errorContext/errorContextProvider';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <>
      <TodoContextProvider>
        <ErrorContextProvider>
          <App />
        </ErrorContextProvider>
      </TodoContextProvider>
    </>,
  );
