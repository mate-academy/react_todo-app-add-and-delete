/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, deleteTodo, addTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

// type Filter = 'all' | 'active' | 'completed';
enum Filter  {
      All = 'all',
      Completed = 'completed',
      Active = 'active',
    };
enum ErrorMessages {
  Load = 'Unable to load todos',
  Title = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [title, setTitle] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.Load))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (selectedFilter === 'active') {
      return !todo.completed;
    }

    if (selectedFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const deleteTodoHandler = async (id: number) => {
    try {
      setLoadingTodosIds((prev: number[]) => [...prev, id]);
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessages.Delete);
      // setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoadingTodosIds((prev: number[]) =>
        prev.filter((loadingTodoId: number) => loadingTodoId !== id),
      );
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodoHandler(todo.id);
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessages.Title);

      return;
    }

    const newTemp: Todo = {
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTemp);
    setLoading(true);

    try {
      const newTodo = await addTodo({
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessages.Add);
    } finally {
      setTempTodo(null);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.length > 0 && todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="What needs to be done?"
              disabled={loading}
              autoFocus
              ref={inputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              key={todo.id}
              className={classNames('todo', {
                completed: todo.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  readOnly
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodoHandler(todo.id)}
              >
                ×
              </button>

              {/* This form is shown instead of the title and remove button */}
              {false && (
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form>
              )}

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingTodosIds.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  readOnly
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link ', {
                  selected: selectedFilter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSelectedFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link ', {
                  selected: selectedFilter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSelectedFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link ', {
                  selected: selectedFilter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelectedFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {/* show only one message at a time */}
        <br />
        {errorMessage}
      </div>
    </div>
  );
};
