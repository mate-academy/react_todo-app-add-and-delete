import React from 'react';
import { TodoApp } from './components/TodoApp';
import { UserWarning } from './UserWarning';
import { USER_ID } from './variables/UserID';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp />
  );
};
