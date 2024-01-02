import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider, TodosProvider } from './context';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <AuthProvider>
      <TodosProvider>
        <App />
      </TodosProvider>
    </AuthProvider>,
  );
