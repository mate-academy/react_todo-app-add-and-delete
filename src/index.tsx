import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import './app/styles/global.scss';

import { App } from './app/App';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
