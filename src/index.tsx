import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './components/TodosContext/TodosContext';
import { FilterByProvider } from './components/FilterContext/FilterContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <FilterByProvider>
      <TodosProvider>
        <App />
      </TodosProvider>
    </FilterByProvider>,
  );
