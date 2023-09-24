/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import classNames from 'classnames';

import { TodoFilter } from './types/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { CurrentError } from './types/CurrentError';
import { TodoContext } from './Context/TodoContext';

export const App: React.FC = () => {
  const { todos, error, setError } = useContext(TodoContext);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>(TodoFilter.All);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(CurrentError.Default);
      }, 3000);
    }
  }, [error]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, todoFilter);
  }, [todos, todoFilter]);

  const handleSetTodoFilter = (filter: TodoFilter) => (
    setTodoFilter(filter)
  );

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodosCount={activeTodosCount}
        />

        <TodoList
          todos={filteredTodos}
        />

        {!!todos.length && (
          <TodoFooter
            filter={todoFilter}
            setFilter={handleSetTodoFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(CurrentError.Default)}
        />
        {error}
      </div>
    </div>
  );
};
