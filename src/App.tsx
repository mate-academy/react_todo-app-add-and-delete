/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import * as postService from './api/todos';
import { FilterParams } from './types/messages';
import { ErrorMessages } from './types/messages';

export const App: React.FC = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [previousActiveCount, setPreviousActiveCount] = useState<number>(
    data.filter(todo => !todo.completed).length,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );

  useEffect(() => {
    const inputField = document.querySelector(
      '.todoapp__new-todo',
    ) as HTMLInputElement;

    if (inputField) {
      inputField.focus();
    }
  }, [isDeleting]);

  useEffect(() => {
    if (!isSubmitting) {
      const inputField = document.querySelector(
        '.todoapp__new-todo',
      ) as HTMLInputElement;

      if (inputField) {
        inputField.focus();
      }
    }
  }, [isSubmitting]);

  useEffect(() => {
    setErrorMessage(ErrorMessages.None);
    getTodos()
      .then(setData)
      .catch(() => setErrorMessage(ErrorMessages.OnGet));
  }, []);

  useEffect(() => {
    if (errorMessage !== ErrorMessages.None) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessages.None);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const filteredTodos = data.filter(todo => {
    switch (filter) {
      case FilterParams.Active:
        return !todo.completed;
      case FilterParams.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  function createTodo() {
    if (newTodoTitle.trim() === '') {
      setErrorMessage(ErrorMessages.OnEmptyTitle);

      return;
    }

    const newTodoData = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setPreviousActiveCount(data.filter(todo => !todo.completed).length);

    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setData(currentTodos => [...currentTodos, tempTodo]);
    setIsSubmitting(true);
    setLoading(true);

    postService
      .createTodo(newTodoData)
      .then(newTodo => {
        setData(currentTodos =>
          currentTodos.map(todo => (todo.id === 0 ? newTodo : todo)),
        );
        setNewTodoTitle('');
      })
      .catch(() => {
        setData(currentTodos => currentTodos.filter(todo => todo.id !== 0));
        setErrorMessage(ErrorMessages.OnPost);
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoading(false);
      });
  }

  function deleteCompletedTodos() {
    const completedTodos = data.filter(todo => todo.completed);

    const completedIds = completedTodos.map(todo => todo.id);

    const deletePromises = completedIds.map(id =>
      postService.deleteTodo(id).then(() => id),
    );

    Promise.allSettled(deletePromises)
      .then(results => {
        const successIds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);

        const isSomeFailed = results.some(
          result => result.status === 'rejected',
        );

        if (isSomeFailed) {
          setErrorMessage(ErrorMessages.OnDelete);
        }

        setData(currentTodos =>
          currentTodos.filter(todo => !successIds.includes(todo.id)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnDelete);
      })
      .finally(() => { });

    const inputField = document.querySelector(
      '.todoapp__new-todo',
    ) as HTMLInputElement;

    if (inputField) {
      inputField.focus();
    }
  }

  function deleteTodo(id: number) {
    setLoading(true);
    setIsDeleting(true);

    postService
      .deleteTodo(id)
      .then(() => {
        setData(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnDelete);
      })
      .finally(() => {
        setLoading(false);
        setIsDeleting(false);
      });
  }

  function handleToggle(id: number) {
    setData(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === 'Enter';

    if (isEnterKey) {
      e.preventDefault();
      createTodo();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {data.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: data.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              aria-label="Toggle all todos"
            />
          )}

          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
        </header>

        {data.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active':
                      (todo.id === 0 && isLoading) || (isLoading && isDeleting),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {data.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {isSubmitting
                ? previousActiveCount
                : data.filter(todo => !todo.completed).length}{' '}
              items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === FilterParams.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterParams.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === FilterParams.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterParams.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === FilterParams.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterParams.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={data.filter(todo => todo.completed).length === 0}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === ErrorMessages.None },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessages.None)}
          aria-label="Hide error notification"
        />
        {errorMessage}
      </div>
    </div>
  );
};
