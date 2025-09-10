/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorType, FilterType, LoadedTodo, Todo } from './types/Types';
import { TodoList } from './components/TodoList/TodoList';
import classNames from 'classnames';
import { FormAddTodo } from './components/FormAddTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortFilter, setSortFilter] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodo, setDeletedTodo] = useState<number | null>(null);

  const [loadedTodo, setLoadedTodo] = useState<LoadedTodo>({
    isLoad: false,
    id: null,
  });

  function handleDeleteCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            setTodos(prev =>
              prev.filter(t => t.id !== completedTodos[index].id),
            );
          }
        });

        const hasError = results.some(r => r.status === 'rejected');

        if (hasError) {
          setError(ErrorType.CantDelete);
        }
      },
    );
  }

  const preparedTodos = useMemo(() => {
    if (sortFilter === 'Completed') {
      return todos.filter(todo => todo.completed);
    }

    if (sortFilter === 'Active') {
      return todos.filter(todo => !todo.completed);
    }

    return todos;
  }, [todos, sortFilter]);

  const todosCounter = todos.filter(todo => !todo.completed).length;

  const CompletedCount = todos.filter(todo => todo.completed).length < 1;

  useEffect(() => {
    getTodos()
      .then(resp => {
        setTodos(resp);
      })

      .catch(() => {
        setError(ErrorType.СantLoad);
        const timer = setTimeout(() => setError(ErrorType.None), 3000);

        return () => clearTimeout(timer);
      });
  }, []);

  const handleSortFilterChange = (filter: FilterType) => {
    setSortFilter(filter);
  };

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}

          <FormAddTodo
            setError={setError}
            setTodos={setTodos}
            CompletedCount={CompletedCount}
            setTempTodo={setTempTodo}
            loadedTodo={loadedTodo}
            setLoadedTodo={setLoadedTodo}
            deletedTodo={deletedTodo}
          />
        </header>

        <TodoList
          todos={preparedTodos}
          setTodos={setTodos}
          setError={setError}
          loadedTodo={loadedTodo}
          tempTodo={tempTodo}
          deletedTodo={deletedTodo}
          setDeletedTodo={setDeletedTodo}
        />

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter} items left
            </span>

            {/* Active link should have the 'selected' class */}

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: sortFilter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleSortFilterChange(FilterType.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: sortFilter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleSortFilterChange(FilterType.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: sortFilter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleSortFilterChange(FilterType.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteCompleted}
              disabled={CompletedCount}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />

        {error}

        {/*
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
        */}
      </div>
    </div>
  );
};
