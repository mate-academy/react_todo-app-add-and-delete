/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodosProvider } from './Components/TodosContext/TodosContext';
import { TodoApp } from './Components/TodoApp';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
