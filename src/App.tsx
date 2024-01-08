import React from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoApp } from './components/TodoApp';
import { USER_ID } from './utils/constants';

export const App: React.FC = () => {
  return (
    USER_ID ? (
      <TodoApp />
    ) : (
      <UserWarning />
    )
  );
};
