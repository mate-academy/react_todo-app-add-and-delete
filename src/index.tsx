import { createRoot } from 'react-dom/client';
// import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodoProvider } from './components/TodoContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodoProvider>
      <App />
    </TodoProvider>,
  );
