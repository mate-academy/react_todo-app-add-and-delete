/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { TodosList } from './components/TodosList/TodosList';
import { Todo } from './types/Todo';

enum FilterForTodo {
  ALL,
  ACTIVE,
  COMPLETED,
}

const USER_ID = 10725;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState<FilterForTodo>(FilterForTodo.ALL);
  const [isVisibleError, setIsVisibleError] = useState(false);
  const [isValidData, setIsValidData] = useState({
    isAddError: false,
    isDeleteError: false,
    isUpdateError: false,
    isLoadError: false,
  });

  useEffect(() => {
    getTodos(USER_ID)
      .then(todo => (setTodos(todo as Todo[])))
      .catch(() => {
        setIsValidData((prevData) => ({
          ...prevData,
          isLoadError: true,
        }));
        setIsVisibleError(true);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleRemoveError = () => {
    setIsVisibleError(false);
  };

  setTimeout(() => {
    if (isVisibleError) {
      handleRemoveError();
    }
  }, 3000);

  const visibleTodos = todos.filter(todo => {
    switch (filterTodo) {
      case FilterForTodo.ALL:
        return todo;

      case FilterForTodo.ACTIVE:
        return todo.completed === false;

      case FilterForTodo.COMPLETED:
        return todo.completed === true;

      default:
        throw new Error(`Wrong filter, ${filterTodo} is not defined`);
    }
  });

  const isCompleted = Boolean(visibleTodos.find(todo => todo.completed));

  const {
    isAddError,
    isDeleteError,
    isUpdateError,
    isLoadError,
  } = isValidData;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodosList
          todos={visibleTodos}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterTodo === FilterForTodo.ALL,
                })}
                defaultValue="all"
                onClick={() => setFilterTodo(FilterForTodo.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterTodo === FilterForTodo.ACTIVE,
                })}
                onClick={() => setFilterTodo(FilterForTodo.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterTodo === FilterForTodo.COMPLETED,
                })}
                onClick={() => setFilterTodo(FilterForTodo.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!isCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isVisibleError,
        },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleRemoveError}
        />

        {isAddError && (
          <>
            Unable to add a todo
            <br />
          </>
        )}

        {isDeleteError && (
          <>
            Unable to delete a todo
            <br />
          </>
        )}

        {isUpdateError && (
          <>
            Unable to update a todo
            <br />
          </>
        )}

        {isLoadError && (
          <>
            Unable to load a todos
            <br />
          </>
        )}
      </div>
    </div>
  );
};
