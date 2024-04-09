/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';

import { USER_ID, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { useTodosContext } from './utils/useTodosContext';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { onErrors } from './utils/onErrors';
import { Errors } from './enums/Errors';

export const App: React.FC = () => {
  const { todos, setTodos, setErrorMessage, preparedTodos } = useTodosContext();

  useEffect(() => {
    setErrorMessage(null);
    getTodos()
      .then(setTodos)
      .catch(() => {
        onErrors(Errors.LoadTodos, setErrorMessage);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {!!todos.length && (
          <>
            <TodoList todos={preparedTodos} />
            {<TodoFooter />}
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
