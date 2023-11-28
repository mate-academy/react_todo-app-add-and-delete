import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<App />);

// import { createRoot } from 'react-dom/client';

// import './styles/index.css';
// import './styles/todo-list.css';
// import './styles/filters.css';

// import { App } from './App';

// const container = document.getElementById('root') as HTMLDivElement;

// createRoot(container).render(<App />);
