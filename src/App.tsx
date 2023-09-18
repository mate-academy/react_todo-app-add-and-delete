import React from 'react';
// import { UserWarning } from './UserWarning';
import { UserTodoList } from './components/UserTodoList';
import { GlobalStateProvider } from './components/GlobalStateProvider';

export const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <UserTodoList />
    </GlobalStateProvider>
  );
};
