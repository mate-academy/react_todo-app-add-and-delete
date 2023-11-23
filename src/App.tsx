import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { TodosContext, TodosProvider } from './components/TodosContext';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  const { USER_ID } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
