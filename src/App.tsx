import React from 'react';
// import { UserWarning } from './UserWarning';
import { UserTodoList } from './components/UserTodoList';
import { GlobalStateProvider } from './components/GlobalStateProvider';

// const USER_ID = 11147;

export const App: React.FC = () => {
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <GlobalStateProvider>
      <UserTodoList />
    </GlobalStateProvider>
  );
};
