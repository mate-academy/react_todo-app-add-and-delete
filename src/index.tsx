import { createRoot } from 'react-dom/client';

import { AppProvider } from './ContextProvider/AppContext';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
