import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosContextProvider } from './context/TodoContext';

const Root = () => (
  <TodosContextProvider>
    <App />
  </TodosContextProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement).render(<Root />);
