/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { UserTodoList } from './components/UserTodoList';
import { GlobalStateProvider } from './components/StateProvider';

const USER_ID = 11549;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <GlobalStateProvider>
      <UserTodoList />
    </GlobalStateProvider>
  );
};
