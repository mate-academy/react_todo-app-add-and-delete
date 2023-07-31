/* eslint-disable import/no-cycle */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodosProvider } from './context/TodosContext';
import { AppBody } from './components/AppBody';

export const USER_ID = 11224;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <AppBody />
    </TodosProvider>
  );
};
