/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { GlobalProvider } from './context/TodoContext';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  return (
    <GlobalProvider>
      <TodoApp />
    </GlobalProvider>
  );
};
