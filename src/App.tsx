/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import TodoApp from './components/TodoApp';
import { TodosProvider } from './contexts/TodosContext';

const USER_ID = 12058;

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
