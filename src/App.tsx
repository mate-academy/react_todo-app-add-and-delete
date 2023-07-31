/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoProvider } from './context/todo.context';
import TodoWidget from './components/TodoWidget';

export const App: React.FC = () => {
  return (
    <TodoProvider>
      <TodoWidget />
    </TodoProvider>
  );
};
