/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  createTodo,
  deleteTodo as deleteTodoRequest,
  getTodos,
  Todo,
} from './styles/api';
import { UserWarning } from './UserWarning';

type Filter = 'all' | 'active' | 'completed';

const USER_ID = 3;

export const App: React.FC = () => {
  const [userId] = useState(USER_ID);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, [userId]);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setErrorMessage(''), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const submitTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId,
      title: trimmedTitle,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(temporaryTodo);

    try {
      const createdTodo = await new Promise<Todo>((resolve, reject) => {
        window.setTimeout(() => {
          createTodo(trimmedTitle, userId).then(resolve, reject);
        }, 0);
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (
    todo: Todo,
    shouldShowError = true,
  ): Promise<boolean> => {
    setProcessingIds(currentIds => new Set(currentIds).add(todo.id));

    try {
      await new Promise<void>((resolve, reject) => {
        window.setTimeout(() => {
          deleteTodoRequest(todo.id).then(() => resolve(), reject);
        }, 0);
      });
      setTodos(currentTodos =>
        currentTodos.filter(item => item.id !== todo.id),
      );

      return true;
    } catch {
      if (shouldShowError) {
        showError('Unable to delete a todo');
      }

      return false;
    } finally {
      setProcessingIds(currentIds => {
        const nextIds = new Set(currentIds);

        nextIds.delete(todo.id);

        return nextIds;
      });
      inputRef.current?.focus();
    }
  };

  const clearCompleted = async () => {
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);
    const results = await Promise.all(
      completedTodos.map(todo => removeTodo(todo, false)),
    );

    if (results.some(success => !success)) {
      showError('Unable to delete a todo');
    }

    inputRef.current?.focus();
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!userId) {
    return <UserWarning />;
  }

  const renderTodo = (todo: Todo, isProcessed: boolean) => (
    <div
      key={todo.id || 'temp'}
      className={classNames('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      <div className="todo__status-label">
        <input
          aria-label={`Completion status for ${todo.title}`}
          className="todo__status"
          type="checkbox"
          checked={todo.completed}
          readOnly
          data-cy="TodoStatus"
        />
      </div>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      {!isProcessed && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo)}
        >
          ×
        </button>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  const renderTodo = (todo: Todo, isProcessed: boolean) => (
    <div
      key={todo.id || 'temp'}
      className={classNames('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      <div className="todo__status-label">
        <input
          aria-label={`Completion status for ${todo.title}`}
          className="todo__status"
          type="checkbox"
          checked={todo.completed}
          readOnly
          data-cy="TodoStatus"
        />
      </div>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      {!isProcessed && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo)}
        >
          ×
        </button>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  return (
    <section className="todoapp">
      <header className="todoapp__header">
        <h1 className="todoapp__title">todos</h1>
        <form onSubmit={submitTodo}>
          <input
            ref={inputRef}
            className="todoapp__new-todo"
            data-cy="NewTodoField"
            placeholder="What needs to be done?"
            value={title}
            onChange={event => setTitle(event.target.value)}
            disabled={isAdding}
            autoFocus
          />
        </form>
      </header>

      {(todos.length > 0 || tempTodo) && (
        <section className="todoapp__content">
          <div className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo =>
              renderTodo(todo, processingIds.has(todo.id)),
            )}
            {tempTodo && renderTodo(tempTodo, true)}
          </div>

          {todos.length > 0 && (
            <footer className="todoapp__footer">
              <span className="todo-count" data-cy="TodosCounter">
                <strong>{activeCount}</strong>{' '}
                {activeCount === 1 ? 'item' : 'items'} left
              </span>

              <nav className="filter" data-cy="Filter">
                {(['all', 'active', 'completed'] as const).map(filterName => (
                  <a
                    key={filterName}
                    href={`#/${filterName}`}
                    className={classNames('filter__link', {
                      selected: filter === filterName,
                    })}
                    data-cy={`FilterLink${filterName[0].toUpperCase()}${filterName.slice(1)}`}
                    onClick={event => {
                      event.preventDefault();
                      setFilter(filterName);
                    }}
                  >
                    {filterName[0].toUpperCase() + filterName.slice(1)}
                  </a>
                ))}
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompletedTodos}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          )}
        </section>
      )}

      <div
        className={classNames('notification is-danger is-light', {
          hidden: !errorMessage,
        })}
        data-cy="ErrorNotification"
      >
        {errorMessage}
        <button
          type="button"
          className="delete"
          aria-label="Hide error"
          data-cy="HideErrorButton"
          onClick={() => setErrorMessage('')}
        />
      </div>
    <section className="todoapp">
      <header className="todoapp__header">
        <h1 className="todoapp__title">todos</h1>
        <form onSubmit={submitTodo}>
          <input
            ref={inputRef}
            className="todoapp__new-todo"
            data-cy="NewTodoField"
            placeholder="What needs to be done?"
            value={title}
            onChange={event => setTitle(event.target.value)}
            disabled={isAdding}
            autoFocus
          />
        </form>
      </header>

      {(todos.length > 0 || tempTodo) && (
        <section className="todoapp__content">
          <div className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo =>
              renderTodo(todo, processingIds.has(todo.id)),
            )}
            {tempTodo && renderTodo(tempTodo, true)}
          </div>

          {todos.length > 0 && (
            <footer className="todoapp__footer">
              <span className="todo-count" data-cy="TodosCounter">
                <strong>{activeCount}</strong>{' '}
                {activeCount === 1 ? 'item' : 'items'} left
              </span>

              <nav className="filter" data-cy="Filter">
                {(['all', 'active', 'completed'] as const).map(filterName => (
                  <a
                    key={filterName}
                    href={`#/${filterName}`}
                    className={classNames('filter__link', {
                      selected: filter === filterName,
                    })}
                    data-cy={`FilterLink${filterName[0].toUpperCase()}${filterName.slice(1)}`}
                    onClick={event => {
                      event.preventDefault();
                      setFilter(filterName);
                    }}
                  >
                    {filterName[0].toUpperCase() + filterName.slice(1)}
                  </a>
                ))}
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompletedTodos}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          )}
        </section>
      )}

      <div
        className={classNames('notification is-danger is-light', {
          hidden: !errorMessage,
        })}
        data-cy="ErrorNotification"
      >
        {errorMessage}
        <button
          type="button"
          className="delete"
          aria-label="Hide error"
          data-cy="HideErrorButton"
          onClick={() => setErrorMessage('')}
        />
      </div>
    </section>
  );
};
