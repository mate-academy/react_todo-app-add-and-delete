import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { TodoProvider } from './components/TodoContext';

const Root = () => (
  <AuthProvider>
    <TodoProvider>
      <App />
    </TodoProvider>
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
