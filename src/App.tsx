import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const ERROR_TIMEOUT = 3000;

const getVisibleTodos = (todos: Todo[], filter: FilterStatus) => {
  switch (filter) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);

    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

const getFilterFromHash = (): FilterStatus => {
  switch (window.location.hash) {
    case '#/active':
      return FilterStatus.Active;

    case '#/completed':
      return FilterStatus.Completed;

    default:
      return FilterStatus.All;
  }
};

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(getFilterFromHash);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [focusVersion, setFocusVersion] = useState(0);
  const errorTimeoutId = useRef<number | null>(null);
  const pendingDeletions = useRef(new Set<number>());

  const hideError = useCallback(() => {
    if (errorTimeoutId.current !== null) {
      window.clearTimeout(errorTimeoutId.current);
      errorTimeoutId.current = null;
    }

    setErrorMessage(null);
  }, []);

  const showError = useCallback((message: ErrorMessage) => {
    if (errorTimeoutId.current !== null) {
      window.clearTimeout(errorTimeoutId.current);
    }

    setErrorMessage(message);
    errorTimeoutId.current = window.setTimeout(() => {
      setErrorMessage(null);
      errorTimeoutId.current = null;
    }, ERROR_TIMEOUT);
  }, []);

  useEffect(() => {
    let isMounted = true;

    hideError();
    setIsLoadingTodos(true);

    getTodos()
      .then(loadedTodos => {
        if (isMounted) {
          setTodos(loadedTodos);
        }
      })
      .catch(() => {
        if (isMounted) {
          showError(ErrorMessage.LoadTodos);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingTodos(false);
        }
      });

    return () => {
      isMounted = false;

      if (errorTimeoutId.current !== null) {
        window.clearTimeout(errorTimeoutId.current);
      }
    };
  }, [hideError, showError]);

  useEffect(() => {
    const handleHashChange = () => {
      setSelectedFilter(getFilterFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    if (tempTodo) {
      return false;
    }

    hideError();

    if (!title) {
      showError(ErrorMessage.EmptyTitle);

      return false;
    }

    const newTodo = { title, completed: false, userId: USER_ID };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      return true;
    } catch {
      showError(ErrorMessage.AddTodo);

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (pendingDeletions.current.has(todoId)) {
      return;
    }

    hideError();
    pendingDeletions.current.add(todoId);
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.DeleteTodo);
    } finally {
      pendingDeletions.current.delete(todoId);
      setDeletingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      setFocusVersion(currentVersion => currentVersion + 1);
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        void handleDeleteTodo(todo.id);
      });
  };

  const visibleTodos = getVisibleTodos(todos, selectedFilter);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllTodosCompleted = todos.length > 0 && activeTodosCount === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: areAllTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              aria-label="Toggle all todos"
              disabled
            />
          )}

          <NewTodo
            isDisabled={isLoadingTodos || tempTodo !== null}
            onAdd={handleAddTodo}
            focusVersion={focusVersion}
          />
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={visibleTodos}
              deletingTodoIds={deletingTodoIds}
              onDelete={handleDeleteTodo}
            />

            {tempTodo && <TodoItem todo={tempTodo} isLoading />}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <Filter
              selectedFilter={selectedFilter}
              onSelect={setSelectedFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', {
          'is-active': isLoadingTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={hideError} />
    </div>
  );
};

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return <TodoApp />;
};
