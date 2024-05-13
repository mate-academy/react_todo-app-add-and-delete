/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoProvider } from './components/TodoContext';
import { TodoApp } from './components/TodoApp';

const USER_ID = 552;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};
