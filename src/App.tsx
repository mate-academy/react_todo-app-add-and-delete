/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodosProvider } from './components/TododsContext/TodosContext';
import { TodoApp } from './components/TodoApp';

const USER_ID = 12068;

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );

  if (!USER_ID) {
    return <UserWarning />;
  }
};
