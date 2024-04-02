import React from 'react';
import { ErrorNotification } from './ErrorNotification';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Header } from './Header';
import { useTodos } from '../utils/TodoContext';

export const TodoApp: React.FC = () => {
  const { todos } = useTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
