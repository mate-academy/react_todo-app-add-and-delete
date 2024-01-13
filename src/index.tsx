import { createRoot } from 'react-dom/client';
import { App } from './App';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

const root = createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
  <App />,
);
