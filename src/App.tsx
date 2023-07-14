import { FC } from 'react';
import { TodoApp } from './components/TodoApp';
import { TodoProvider } from './components/TodoContext';

export const App: FC = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};
