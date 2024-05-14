import React, { useContext } from 'react';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorNotification } from './ErrorNotification';
import { TodoContext } from './TodoContext';

export const TodoApp: React.FC = () => {
  const { error } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>

        <Footer />
      </div>

      <ErrorNotification error={error} />
    </div>
  );
};
