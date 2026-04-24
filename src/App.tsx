/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

type FilterType = 'all' | 'active' | 'completed';

const ERROR_TIMEOUT = 3000;

function getUserId() {
  const storedUser = window.localStorage.getItem('user');

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as { id?: number };

    return typeof user.id === 'number' ? user.id : null;
  } catch {
    return null;
  }
}

function getVisibleTodos(todos: Todo[], filterBy: FilterType) {
  switch (filterBy) {
    case 'active':
      return todos.filter(todo => !todo.completed);

    case 'completed':
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading = false,
  onDelete,
}) => {
  const statusId = `todo-status-${todo.id}`;

  return (
    <article
      className={classNames('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      <div className="todo__status-label">
        <input
          aria-label="Todo status"
          checked={todo.completed}
          className="todo__status"
          data-cy="TodoStatus"
          id={statusId}
          readOnly
          type="checkbox"
        />
      </div>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      <button
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={isLoading || !onDelete}
        onClick={() => onDelete?.(todo.id)}
        type="button"
      >
        x
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </article>
  );
};

export const App: React.FC = () => {
  const userId = getUserId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const visibleTodos = getVisibleTodos(todos, filterBy);
  const hasTodos = todos.length > 0;
  const isClearingCompleted =
    completedTodos.length > 0 &&
    completedTodos.every(todo => processingIds.includes(todo.id));

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const hideError = () => {
    setErrorMessage('');
  };

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isCancelled = false;

    getTodos(userId)
      .then(loadedTodos => {
        if (!isCancelled) {
          setTodos(loadedTodos);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          showError('Unable to load todos');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      hideError();
    }, ERROR_TIMEOUT);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  const handleDeleteTodo = async (todoId: number, shouldFocus = true) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));

      if (shouldFocus) {
        focusInput();
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    hideError();

    const title = newTitle.trim();

    if (!title) {
      showError('Title should not be empty');
      focusInput();

      return;
    }

    if (!userId) {
      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setIsCreating(true);

    try {
      const createdTodo = await createTodo({
        userId,
        title,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setNewTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsCreating(false);
      focusInput();
    }
  };

  const handleClearCompleted = async () => {
    if (!completedTodos.length) {
      return;
    }

    hideError();

    await Promise.all(
      completedTodos.map(todo => handleDeleteTodo(todo.id, false)),
    );

    focusInput();
  };

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
              type="button"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="todoapp__new-todo"
              data-cy="NewTodoField"
              disabled={isCreating}
              onChange={event => setNewTitle(event.target.value)}
              placeholder="What needs to be done?"
              ref={inputRef}
              value={newTitle}
            />
          </form>
        </header>

        {(hasTodos || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                isLoading={processingIds.includes(todo.id)}
                key={todo.id}
                onDelete={todoId => {
                  hideError();
                  void handleDeleteTodo(todoId);
                }}
                todo={todo}
              />
            ))}

            {tempTodo && <TodoItem isLoading todo={tempTodo} />}
          </section>
        )}

        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} item${activeTodos.length === 1 ? '' : 's'} left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                className={classNames('filter__link', {
                  selected: filterBy === 'all',
                })}
                data-cy="FilterLinkAll"
                href="#/"
                onClick={event => {
                  event.preventDefault();
                  setFilterBy('all');
                }}
              >
                All
              </a>

              <a
                className={classNames('filter__link', {
                  selected: filterBy === 'active',
                })}
                data-cy="FilterLinkActive"
                href="#/active"
                onClick={event => {
                  event.preventDefault();
                  setFilterBy('active');
                }}
              >
                Active
              </a>

              <a
                className={classNames('filter__link', {
                  selected: filterBy === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                href="#/completed"
                onClick={event => {
                  event.preventDefault();
                  setFilterBy('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0 || isClearingCompleted}
              onClick={() => {
                void handleClearCompleted();
              }}
              type="button"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
        data-cy="ErrorNotification"
      >
        <button
          className="delete"
          data-cy="HideErrorButton"
          onClick={hideError}
          type="button"
        />
        {errorMessage}
      </div>
    </div>
  );
};
