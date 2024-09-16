import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return <TodoApp />;
};
