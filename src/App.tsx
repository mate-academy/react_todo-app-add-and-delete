/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoApp } from './components/TodoApp';
import { TodosContextProvider } from './Contexts/TodosContext';
import { ErrorMessageContextProvider } from './Contexts';

export const App: React.FC = () => {
  return (
    <TodosContextProvider>
      <ErrorMessageContextProvider>
        <TodoApp />
      </ErrorMessageContextProvider>
    </TodosContextProvider>
  );
};
