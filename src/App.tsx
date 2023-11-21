/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoApp } from './components/TodoApp';
import { TodoAppContext } from './components/TodoStore';

const USER_ID = 11722;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoAppContext>
      <TodoApp />
    </TodoAppContext>
  );
};
