import React from 'react';
import { TodosContextProvider } from './Contexts/TodosContext';
import { TodoApp } from './components/TodoApp';
import { ErrorContextProvider } from './Contexts/ErrorContext';
import { InputRefContextProvider } from './Contexts/InputRefContext';
import { IsDeletingProvider } from './Contexts/DeletingContext';

export const App: React.FC = () => (
  <ErrorContextProvider>
    <TodosContextProvider>
      <InputRefContextProvider>
        <IsDeletingProvider>
          <TodoApp />
        </IsDeletingProvider>
      </InputRefContextProvider>
    </TodosContextProvider>
  </ErrorContextProvider>
);
