/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoNotification } from './components/TodoNotification';
import { getTodos, filterTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';
import { Error } from './types/Error';

const initialError: Error = {
  state: false,
  type: ErrorType.None,
};

const USER_ID = 6657;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error>(initialError);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => setTodos(response))
      .catch(() => setError({
        state: true,
        type: ErrorType.Update,
      }))
      .finally(() => setTempTodo(null));
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          setError={setError}
        />

        {todos.length
          ? (
            <>
              <TodoList
                todos={filterTodos(todos, filter)}
                tempTodo={tempTodo}
                setError={setError}
              />
              <Footer todos={todos} setFilter={setFilter} filter={filter} />
            </>
          ) : null}
      </div>

      {error.state && (
        <TodoNotification
          setError={setError}
          errorText={error.type}
        />
      )}
    </div>
  );
};
