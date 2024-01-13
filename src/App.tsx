import React from 'react';
import { UserWarning } from './components/UserWarning/UserWarning';
import { TodoApp } from './components/TodoApp';
import { USER_ID } from './types/USER_ID';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp />
  );
};
