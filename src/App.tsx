/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoApp } from './components/TodoApp/TodoApp';
import { Context } from './components/TodoContext/TodoContext';
import { USER_ID } from './utils/UserId';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <Context>
      <TodoApp />
    </Context>
  );
};
