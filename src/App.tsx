/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';

import { ContextProvider } from './Components/ContextProvider';
import { TodoApp } from './Components/TodoApp';

export const USER_ID = 12176;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <ContextProvider>
      <TodoApp />
    </ContextProvider>
  );
};
