/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { handleRequestError } from './utils/handleRequestError';
import { Footer } from './components/Footer/Footer';
import { useTodosContext } from './utils/useTodosContext';

export const App: React.FC = () => {
  const { todos, setTodos, setError } = useTodosContext();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleRequestError(Errors.loadTodo, setError));
  }, [setTodos, setError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length > 0 && (
          <>
            <TodoList />

            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
