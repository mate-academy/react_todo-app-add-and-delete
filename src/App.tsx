/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoNotification } from './components/TodoNotification';
import { getTodos, filterTodos } from './api/todos';
import {
  Error,
  Filter,
  Todo,
  ErrorType,
} from './types';

const initialError: Error = {
  state: false,
  type: ErrorType.None,
};

const USER_ID = 6657;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(Filter.All);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    try {
      const getServerTodos = async () => {
        const response = await getTodos(USER_ID);

        return response;
      };

      getServerTodos()
        .then(setTodos);
    } catch {
      setError({
        state: true,
        type: ErrorType.Update,
      });
    } finally {
      setTempTodo(null);
    }
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

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos(todos, filter)}
              tempTodo={tempTodo}
              setError={setError}
            />
            <Footer todos={todos} setFilter={setFilter} filter={filter} />
          </>
        )}
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
