import React from 'react';
import { UserWarning } from './UserWarning';
import { TodosProvider } from './TodosContext';
import { TodoApp } from './components/TodoApp';

const USER_ID = 11138;

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
