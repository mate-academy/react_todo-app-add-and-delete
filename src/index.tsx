import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './components/context/TodosContext';
import { ErrorProvider } from './components/context/ErrorContext';

const Root = () => (
  <ErrorProvider>
    <TodosProvider>
      <App />
    </TodosProvider>
  </ErrorProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement).render(<Root />);
