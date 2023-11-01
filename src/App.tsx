import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoApp } from './components/TodoApp/TodoApp';
import { TodosProvider } from './components/TodosContext/TodosContext';

const USER_ID = 11813;

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
