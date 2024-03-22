import React from 'react';
import { TodosContextProvider } from './components/TodosContext';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => (
  <TodosContextProvider>
    <TodoApp />
  </TodosContextProvider>
);
