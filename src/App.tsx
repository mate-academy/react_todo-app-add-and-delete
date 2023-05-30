/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

const USER_ID = 10565;

enum ShowTodos {
  All,
  Active,
  Completed,
}

const todosFromServer = client
  .get<Todo[]>(`/todos?userId=${USER_ID}`);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<ShowTodos>(ShowTodos.All);

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    setError(null);
    todosFromServer
      .then(fetchTodos => setTodos(fetchTodos))
      .catch(() => {
        setError('Todos not found, error');
        clearError();
      });
  }, []);
  const handleFilterSelect = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.currentTarget.textContent) {
      case 'Active':
        setSelectedTodos(ShowTodos.Active);
        break;
      case 'Completed':
        setSelectedTodos(ShowTodos.Completed);
        break;
      default:
        setSelectedTodos(ShowTodos.All);
        break;
    }
  };

  const getFilteredTodos = (showTodos: ShowTodos) => {
    switch (showTodos) {
      case ShowTodos.Active:
        return todos.filter(todo => !todo.completed);
      case ShowTodos.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const filteredTodos = React.useMemo(() => {
    return getFilteredTodos(selectedTodos);
  }, [selectedTodos, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos
          && filteredTodos.length > 0
          && <TodoList todos={filteredTodos} />}

          {/* This todo is being edited */}
          <div className="todo">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            {/* This form is shown instead of the title and remove button */}
            <form>
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          {/* This todo is in loadind state */}
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">Todo is being saved now</span>
            <button type="button" className="todo__remove">×</button>

            {/* 'is-active' class puts this modal on top of the todo */}
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </section>

        {filteredTodos
        && filteredTodos.length > 0
        && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              3 items left
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  {
                    selected: selectedTodos === ShowTodos.All,
                  },
                )}
                onClick={handleFilterSelect}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  {
                    selected: selectedTodos === ShowTodos.Active,
                  },
                )}
                onClick={handleFilterSelect}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  {
                    selected: selectedTodos === ShowTodos.Completed,
                  },
                )}
                onClick={handleFilterSelect}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button type="button" className="todoapp__clear-completed">
              Clear completed
            </button>
          </footer>
        )}

      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === null,
        },
      )}
      >
        <button
          type="button"
          title="delete"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
        {/* show only one message at a time */}
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
