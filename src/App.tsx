/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Notification } from './components/Notification/Notification';
import { TodoList } from './components/TodoList/TodoList';
import { Error, Filter, Todo } from './types/todo';
import { UserWarning } from './UserWarning';
import { filterTodos } from './utils/helpers';

const USER_ID = 11096;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [hasError, setHasError] = useState(Error.Not);
  const [isLoading, setIsLoading] = useState(false);
  const [completedIdx, setCompletedIdx] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID).then(data => {
      setTodos(filterTodos(filter, data));
    })
      .catch(() => {
        setHasError(Error.Load);
      });
  }, [filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  /* eslint-disable-next-line */
  const filteredTodos = useMemo<Todo[]>(() => {
    return filterTodos(filter, todos);
  }, [filter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          userId={USER_ID}
          todos={todos}
          setTodos={
            setTodos as (todos: Todo[] | ((todos: Todo[]) => void)) => void
          }
          filter={filter}
          setHasError={setHasError}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setTempTodo={setTempTodo}
        />

        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            setTodos={setTodos}
            setHasError={setHasError}
            completedIdx={completedIdx}
            tempTodo={tempTodo}
          />
        )}

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            setTodos={setTodos}
            setHasError={setHasError}
            setIsLoading={setIsLoading}
            setCompletedIdx={setCompletedIdx}
          />
        )}
      </div>

      <Notification
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
