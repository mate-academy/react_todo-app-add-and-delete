import React, { useEffect } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { getPreparedTodos } from './utils/getPreparedTodos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { useTodosContext } from './TodoContext';

export const App: React.FC = () => {
  const { todos, filterByStatus, handleError, setTodos } = useTodosContext();

  useEffect(() => {
    getTodos()
      .then(res => {
        setTodos(res);
      })
      .catch(() => handleError('Unable to load todos'));
  }, []);

  const preparedTodos = getPreparedTodos(todos, { filterByStatus });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader todos={preparedTodos} />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList todos={preparedTodos} />
        </section>

        {todos.length > 0 && <TodoFooter todos={preparedTodos} />}
      </div>

      <ErrorNotification />
    </div>
  );
};
