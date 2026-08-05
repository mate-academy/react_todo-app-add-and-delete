import React from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import type { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';

import { TodoList } from './components/TodoList';
import { Footer } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [filterType, setFilterType] = React.useState<FilterTypes>(
    FilterTypes.ALL,
  );

  React.useEffect(() => {
    setIsError(false);
    getTodos()
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => setIsError(true));
  }, []);

  React.useEffect(() => {
    if (!isError) {
      return;
    }

    const timer = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isError]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const visibleTodos = todos.filter(todo => {
    if (filterType === FilterTypes.ACTIVE) {
      return !todo.completed;
    }

    if (filterType === FilterTypes.COMPLETED) {
      return todo.completed;
    }

    return true;
  });
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: areAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList todos={visibleTodos} />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterType={filterType}
            onFilterChange={setFilterType}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification isError={isError} onClose={() => setIsError(false)} />
    </div>
  );
};
