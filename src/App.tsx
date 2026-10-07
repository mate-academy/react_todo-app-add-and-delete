/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList/TodoList';

import { TodoFooter } from './components/TodoFooter/TodoFooter';

import { Filter } from './components/TodoFilter/TodoFilter';

// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

import { TodoItem } from './components/TodoItem/TodoItem';

enum ErrorMessage {
  Load = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
}

type ErrorState = {
  message: ErrorMessage;
  id: number;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [newTodo, setNewTodo] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isAdding, setIsAdding] = useState(false);

  const [deletingTodoIds, setDeletingTodoIds] = useState<Set<number>>(
    new Set(),
  );

  const [isClearingCompleted, setIsClearingCompleted] = useState(false);

  const [error, setError] = useState<ErrorState | null>(null);

  const errorIdRef = useRef(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = useCallback((message: ErrorMessage) => {
    errorIdRef.current += 1;

    setError({
      message,
      id: errorIdRef.current,
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
   * Hide error after 3 seconds.
   */
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(currentError => {
        if (currentError?.id === error.id) {
          return null;
        }

        return currentError;
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  /*
   * Load todos.
   */
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    clearError();

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      });
  }, [clearError, showError]);

  /*
   * Handle filter.
   */
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '#/active') {
        setFilter(Filter.Active);
      } else if (hash === '#/completed') {
        setFilter(Filter.Completed);
      } else {
        setFilter(Filter.All);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  /*
   * Focus input on startup.
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /*
   * Add todo.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    clearError();

    const title = newTodo.trim();

    if (!title) {
      showError(ErrorMessage.EmptyTitle);

      inputRef.current?.focus();

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    setIsAdding(true);

    addTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);

        setNewTodo('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);

        setIsAdding(false);

        /*
         * Wait until React enables the input,
         * then focus it.
         */
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  /*
   * Delete one todo.
   */
  const handleDelete = (todoId: number) => {
    if (deletingTodoIds.has(todoId)) {
      return;
    }

    clearError();

    setDeletingTodoIds(currentIds => {
      const nextIds = new Set(currentIds);

      nextIds.add(todoId);

      return nextIds;
    });

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds => {
          const nextIds = new Set(currentIds);

          nextIds.delete(todoId);

          return nextIds;
        });

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  /*
   * Delete all completed todos.
   */
  const handleClearCompleted = () => {
    if (isClearingCompleted) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    clearError();

    setIsClearingCompleted(true);

    setDeletingTodoIds(currentIds => {
      const nextIds = new Set(currentIds);

      completedTodos.forEach(todo => {
        nextIds.add(todo.id);
      });

      return nextIds;
    });

    const requests = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({
          id: todo.id,
          success: true,
        }))
        .catch(() => ({
          id: todo.id,
          success: false,
        })),
    );

    Promise.all(requests)
      .then(results => {
        const successfulIds = results
          .filter(result => result.success)
          .map(result => result.id);

        const hasError = results.some(result => !result.success);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (hasError) {
          showError(ErrorMessage.Delete);
        }
      })
      .finally(() => {
        setDeletingTodoIds(currentIds => {
          const nextIds = new Set(currentIds);

          completedTodos.forEach(todo => {
            nextIds.delete(todo.id);
          });

          return nextIds;
        });

        setIsClearingCompleted(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleHideError = () => {
    clearError();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  /*
   * Apply current filter.
   */
  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${
              allTodosCompleted ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            deletingTodoIds={deletingTodoIds}
            onDelete={handleDelete}
          />
        )}

        {tempTodo !== null && <TodoItem todo={tempTodo} isLoading />}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            deletingTodoIds={deletingTodoIds}
            isClearingCompleted={isClearingCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error?.message ?? null}
        onClose={handleHideError}
      />
    </div>
  );
};
