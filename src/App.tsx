import React from 'react';

import { TodoProvider } from './Context/TodoContext';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => (

  <TodoProvider>
    <TodoApp />
  </TodoProvider>
);
