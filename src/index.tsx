import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { AppProvider } from './components/AppProvider/AppProvider';

const Root = () => (
  <HashRouter>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </HashRouter>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
