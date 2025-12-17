/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessages } from './enums/ErrorMessages';
import { StatusTypes } from './enums/StatusTypes';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NONE,
  );
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusTypes>(
    StatusTypes.ALL,
  );

  const todosCount = todos.reduce((count, todo) => count + +!todo.completed, 0);

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.GET_ERROR);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage(ErrorMessages.NONE);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errorMessage]);

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
            <TodoList
              todos={todos}
              statusFilter={statusFilter}
              loading={loading}
            />

            <Footer
              todosCount={todosCount}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
