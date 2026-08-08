/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { ErrorMessage, Filter, Todo, User } from './types';
import { TodoItem } from './TodoItem';

const API_URL = 'https://mate.academy/students-api';

const filterOptions = [
  { value: Filter.All, label: 'All', dataCy: 'FilterLinkAll' },
  { value: Filter.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  { value: Filter.Completed, label: 'Completed', dataCy: 'FilterLinkCompleted' },
] as const;

const getUserFromStorage = (): User | null => {
  const rawUser = window.localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as Partial<User>;

    return typeof parsedUser.id === 'number' ? { id: parsedUser.id } : null;
  } catch {
    return null;
  }
};

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = getUserFromStorage();

    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;

    const loadTodos = async () => {
      try {
        const response = await fetch(`${API_URL}/todos?userId=${user.id}`);

        if (!response.ok) {
          throw new Error(ErrorMessage.UnableToLoadTodos);
        }

        const loadedTodos = (await response.json()) as Todo[];

        if (isMounted) {
          setTodos(loadedTodos);
          setError(null);
          setShouldFocusInput(true);
        }
      } catch {
        if (isMounted) {
          setTodos([]);
          setError(ErrorMessage.UnableToLoadTodos);
          setShouldFocusInput(true);
        }
      }
    };

    loadTodos();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setError(null);
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [error]);

  useEffect(() => {
    if (!shouldFocusInput) {
      return;
    }

    inputRef.current?.focus();
    setShouldFocusInput(false);
  }, [shouldFocusInput]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Filter.Active) {
        return !todo.completed;
      }

      if (filter === Filter.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [filter, todos]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const shouldShowFooter = todos.length > 0 || Boolean(tempTodo);
  const shouldShowFilter = todos.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.TitleShouldNotBeEmpty);
      setShouldFocusInput(true);

      return;
    }

    if (!user) {
      return;
    }

    setError(null);
    setIsCreating(true);
    setIsInputDisabled(true);
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempTodo({
      id: 0,
      userId: user.id,
      title: trimmedTitle,
      completed: false,
    });
    setShouldFocusInput(false);

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: trimmedTitle,
          completed: false,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(ErrorMessage.UnableToAddTodo);
      }

      const createdTodo = (await response.json()) as Todo;

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTempTodo(null);
      setTitle('');
      setIsCreating(false);
      setIsInputDisabled(false);
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }

      setShouldFocusInput(true);
    } catch {
      setTempTodo(null);
      setIsCreating(false);
      setIsInputDisabled(false);
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }

      setError(ErrorMessage.UnableToAddTodo);
      setShouldFocusInput(true);
    }
  };

  const handleDelete = async (todoId: number, shouldShowError = true) => {
    setProcessingIds(currentIds =>
      currentIds.includes(todoId) ? currentIds : [...currentIds, todoId],
    );

    if (shouldShowError) {
      setError(null);
    }

    try {
      const response = await fetch(`${API_URL}/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(ErrorMessage.UnableToDeleteTodo);
      }

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setShouldFocusInput(true);

      return true;
    } catch {
      if (shouldShowError) {
        setError(ErrorMessage.UnableToDeleteTodo);
      }

      return false;
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setError(null);

    const results = await Promise.allSettled(
      completedTodos.map(todo => handleDelete(todo.id, false)),
    );

    if (
      results.some(
        result => result.status === 'rejected' || result.value === false,
      )
    ) {
      setError(ErrorMessage.UnableToDeleteTodo);
    }

    setShouldFocusInput(true);
  };

  if (!user) {
    return <UserWarning />;
  }

  return (
    <section className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="todoapp__new-todo"
              data-cy="NewTodoField"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={() => handleDelete(todo.id)}
              isProcessed={processingIds.includes(todo.id)}
            />
          ))}

          {tempTodo && <TodoItem todo={tempTodo} isProcessed={isCreating} />}
        </section>

        {shouldShowFooter && (
          <footer className="todoapp__footer">
            <span className="todoapp__count" data-cy="TodosCounter">
              {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
            </span>

            {shouldShowFilter && (
              <div className="todoapp__filters" data-cy="Filter">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={classNames('todoapp__filter', {
                      selected: filter === option.value,
                    })}
                    data-cy={option.dataCy}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {todos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
                disabled={!hasCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        className={classNames('notification is-danger', { hidden: !error })}
        data-cy="ErrorNotification"
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </section>
  );
};
