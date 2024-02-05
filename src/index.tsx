import { createRoot } from 'react-dom/client';
import React from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';
import { TodoProvider } from './TodoContext';
import { App } from './App';

export const AppWithTodoContext: React.FC = () => {
  return (
    <TodoProvider>
      <App />
    </TodoProvider>
  );
};

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<AppWithTodoContext />);
