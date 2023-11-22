import React from 'react';
import { GlobalStateProvier } from './Components/GlobalStateProvier';
import { TodoApp } from './Components/TodoApp';

export const App: React.FC = () => {
  return (
    <GlobalStateProvier>
      <TodoApp />
    </GlobalStateProvier>
  );
};
