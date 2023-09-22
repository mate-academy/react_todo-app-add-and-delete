import React from 'react';
import { TodoApp } from './components/TodoApp/TodoApp';
import { TodosProvider, USER_ID } from './TodosContext';
import { UserWarning } from './UserWarning';

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
