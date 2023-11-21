import React from 'react';
import { TodoApp } from './TodoApp';
import { TodoProvider } from './TodosContext';

export const App: React.FC = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};
