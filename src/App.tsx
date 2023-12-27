import React from 'react';
import { StateProvider, TodoApp, UserWarning } from './components';
import { USER_ID } from './libs/constants';

export const App: React.FC = () => {
  return (
    USER_ID ? (
      <StateProvider>
        <TodoApp />
      </StateProvider>
    ) : (
      <UserWarning />
    )
  );
};
