/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoProvider } from './TodoContext';
import { TodoAppContent } from './components/TodoAppContent/TodoAppContent';

export const App: React.FC = () => {
  return (
    <TodoProvider>
      <TodoAppContent />
    </TodoProvider>
  );
};
