import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import React from 'react';
import { TodosProvider } from './context/TodoContext';

const Root = () => (
  <TodosProvider>
    <App />
  </TodosProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement).render(<Root />);
