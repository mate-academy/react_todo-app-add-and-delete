import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { AppWithState } from './components/AppWithState/AppWithState';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<AppWithState />);
