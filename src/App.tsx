/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { FilterTypes } from './types/Filter';
import { getTodos } from './api/todos';

const USER_ID = 11133;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorType.None);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);

  useEffect(() => {
    getTodos(USER_ID).then(setTodos).catch(() => setError(ErrorType.Load));
  }, []);

  const filteredTodos = useMemo(() => (() => {
    const visibleTodos = [...todos];

    switch (filter) {
      case FilterTypes.Active:
        return visibleTodos.filter((todo) => !todo.completed);

      case FilterTypes.Completed:
        return visibleTodos.filter((todo) => todo.completed);

      default:
        return visibleTodos;
    }
  })(), [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          userId={USER_ID}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setUpdatingTodos={setUpdatingTodos}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            setTodos={setTodos}
            setError={setError}
            updatingTodos={updatingTodos}
          />
        )}

        {todos.length > 0 && (
          <Filter
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
            setError={setError}
            setIsLoading={setIsLoading}
            setUpdatingTodos={setUpdatingTodos}
          />
        )}
      </div>

      {!ErrorType.None && <Notification error={error} setError={setError} />}
    </div>
  );
};
