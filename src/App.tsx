import React from 'react';
import { TodosProvider } from './services/Store';
import { TodoApp } from './components/todoApp';

export const App: React.FC = () => (
  <TodosProvider>
    <TodoApp />
  </TodosProvider>
);
