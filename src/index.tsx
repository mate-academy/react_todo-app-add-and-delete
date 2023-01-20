import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { LoaderProvider } from './components/Todo/LoaderContext';
import { ErrorProvider } from './components/Error/ErrorContext';
import { TodoProvider } from './components/Todo/TodoContext';

const Root = () => (
  <AuthProvider>
    <TodoProvider>
      <LoaderProvider>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </LoaderProvider>
    </TodoProvider>
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
