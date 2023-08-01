/* eslint-disable */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { useAppContext } from './components/Context/AppContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const {
    userId,
    todos,
  } = useAppContext();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setTempTodo={setTempTodo} />

        {todos && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList tempTodo={tempTodo} />
          </section>
        )}

        {todos && (
          <Footer />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
