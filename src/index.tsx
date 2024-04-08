import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { ProviderTodo } from './components/ContextTodo';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <ProviderTodo>
      <App />
    </ProviderTodo>,
  );
