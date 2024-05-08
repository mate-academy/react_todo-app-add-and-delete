/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoApp } from './components/TodoApp';
import { TodosContextProvider } from './contexts/TodosContext';
import { ErrorMessageContextProvider } from './contexts';

export const App: React.FC = () => {
  return (
    <TodosContextProvider>
      <ErrorMessageContextProvider>
        <TodoApp />
      </ErrorMessageContextProvider>
    </TodosContextProvider>
  );
};
