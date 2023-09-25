import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodoProvider } from './context/TodoContext';
import { FilterProvider } from './context/FilterContext';
import { ErrorProvider } from './context/ErrorContext';
import { TodoTempProvider } from './context/TodoTempContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodoProvider>
      <TodoTempProvider>
        <FilterProvider>
          <ErrorProvider>
            <App />
          </ErrorProvider>
        </FilterProvider>
      </TodoTempProvider>
    </TodoProvider>,
  );
