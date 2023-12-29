import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AutorizationProvider } from './context/AutorizationProvider';
import { TodosProvider } from './context/TodosProvider';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <AutorizationProvider>
      <TodosProvider>
        <App />
      </TodosProvider>
    </AutorizationProvider>,
  );
