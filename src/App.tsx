/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoApp } from './components/TodoApp';
import { ContextProvider } from './TodosContext';
import { UserWarning } from './UserWarning';
import { USER_ID } from './constans';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <ContextProvider>
      <TodoApp userID={USER_ID} />
    </ContextProvider>
  );
};
