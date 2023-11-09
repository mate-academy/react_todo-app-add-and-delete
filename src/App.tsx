import React from 'react';

import { GlobalProvider } from './providers/GlobalContext';

import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  return (
    <GlobalProvider>
      <TodoApp />
    </GlobalProvider>
  );
};
