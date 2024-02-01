/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './variables';
import { TodoApp } from './components/TodoApp/TodoApp';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp />
  );
};
