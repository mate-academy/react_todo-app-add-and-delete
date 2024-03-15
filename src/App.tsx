/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoApp } from './components/TodoApp';
import { TodosProvider } from './components/Todos.Context';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
