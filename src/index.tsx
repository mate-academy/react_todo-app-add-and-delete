import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { GlobalAppProvider } from './context/AppContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <GlobalAppProvider>
    <App />
  </GlobalAppProvider>,
);
