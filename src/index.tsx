import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
