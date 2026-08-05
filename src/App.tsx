/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

type FilterType = 'all' | 'active' | 'completed';

const API_URL = 'https://mate.academy/students-api';

const getUserId = (): number => {
  try {
    const rawUser = localStorage.getItem('user');

    if (!rawUser) {
      return 0;
    }

    const parsedUser = JSON.parse(rawUser) as { id?: number };

    return Number(parsedUser.id ?? 0);
  } catch {
    return 0;
  }
};

const formatCounter = (count: number) => {
  const suffix = count === 1 ? 'item' : 'items';

  return `${count} ${suffix} left`;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const errorTimeoutRef = useRef<number | undefined>(undefined);

  const isInputDisabled = inputDisabled || isAdding || tempTodo !== null;
  const userId = getUserId();

  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const showError = (message: string) => {
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    setError(message);
    errorTimeoutRef.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      if (!userId) {
        setIsLoading(false);

        return;
      }

      try {
        const response = await fetch(`${API_URL}/todos?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to load todos');
        }

        const data = (await response.json()) as Todo[];

        setTodos(data);
      } catch {
        showError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [userId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.disabled = isInputDisabled;
    }
  }, [isInputDisabled]);

  useEffect(() => {
    if (!isAdding && !tempTodo) {
      inputRef.current?.focus();
    }
  }, [filter, todos.length, isAdding, tempTodo, error]);

  const updateTodoStatus = async (todo: Todo, nextCompleted: boolean) => {
    const previousTodos = todos;

    setTodos(currentTodos =>
      currentTodos.map(currentTodo =>
        currentTodo.id === todo.id
          ? { ...currentTodo, completed: nextCompleted }
          : currentTodo,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
    } catch {
      setTodos(previousTodos);
      showError('Unable to update a todo');
    }
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setIsAdding(true);
    setInputDisabled(true);

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId,
    });

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: trimmedTitle,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const createdTodo = (await response.json()) as Todo;

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setInputDisabled(false);

      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    setError('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    try {
      const response = await fetch(`${API_URL}/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    setError('');

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (!completedIds.length) {
      return;
    }

    setProcessingIds(currentIds => [...currentIds, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(async todoId => {
        const response = await fetch(`${API_URL}/todos/${todoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }

        return todoId;
      }),
    );

    const successfulIds = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<number>).value);

    if (successfulIds.length) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    if (results.some(result => result.status === 'rejected')) {
      showError('Unable to delete a todo');
    }

    setProcessingIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );
    inputRef.current?.focus();
  };

  const handleToggleAll = async () => {
    const shouldCompleteAll = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (!todosToUpdate.length) {
      return;
    }

    const updates = todosToUpdate.map(todo =>
      updateTodoStatus(todo, shouldCompleteAll),
    );

    await Promise.allSettled(updates);
  };

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <section className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              aria-label="Toggle all"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              data-cy="NewTodoField"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isInputDisabled}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            const isProcessing = processingIds.includes(todo.id);

            return (
              <div
                key={todo.id}
                className={classNames('todo', { completed: todo.completed })}
                data-cy="Todo"
              >
                <div className="todo__status-label" aria-hidden="true">
                  <input
                    type="checkbox"
                    className="todo__status"
                    data-cy="TodoStatus"
                    checked={todo.completed}
                    aria-label={`Mark ${todo.title} as ${todo.completed ? 'active' : 'completed'}`}
                    onChange={() => updateTodoStatus(todo, !todo.completed)}
                  />
                </div>

                <span className="todo__title" data-cy="TodoTitle">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  aria-label={`Delete ${todo.title}`}
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>

                <span
                  className={classNames('loader', {
                    'is-active': isProcessing,
                  })}
                  data-cy="TodoLoader"
                />
              </div>
            );
          })}

          {tempTodo && (
            <div
              className={classNames('todo', { completed: tempTodo.completed })}
              data-cy="Todo"
            >
              <div className="todo__status-label" aria-hidden="true">
                <input
                  type="checkbox"
                  className="todo__status"
                  data-cy="TodoStatus"
                  checked={false}
                  aria-label="Temporary todo status"
                  readOnly
                />
              </div>

              <span className="todo__title" data-cy="TodoTitle">
                {tempTodo.title}
              </span>

              <span className="loader is-active" data-cy="TodoLoader" />
            </div>
          )}
        </section>

        {!isLoading && todos.length > 0 && (
          <footer className="todoapp__footer">
            <span data-cy="TodosCounter">
              {formatCounter(activeTodosCount)}
            </span>

            <div className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={event => {
                  event.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>
              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={event => {
                  event.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={event => {
                  event.preventDefault();
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </div>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={classNames('notification is-danger', { hidden: !error })}
        data-cy="ErrorNotification"
        role="alert"
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          aria-label="Hide error"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </section>
  );
};
