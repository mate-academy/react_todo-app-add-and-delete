import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoApp } from './components/todoApp/TodoApp';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return <TodoApp />;
};
