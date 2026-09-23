/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { Filter, FilterType } from './components/Filter';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const ERROR_HIDE_DELAY = 3000;

const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setErrorMessage(message);

    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage('');
    }, ERROR_HIDE_DELAY);
  };

  const hideError = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    setErrorMessage('');
  };

  useEffect(() => {
    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isAdding && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isAdding, isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const shouldShowTempTodo = filter !== FILTERS.completed;

  const allVisibleTodos =
    shouldShowTempTodo && tempTodo
      ? [...visibleTodos, tempTodo]
      : visibleTodos;

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = inputRef.current;

    if (!input || isAdding) {
      return;
    }

    const title = input.value.trim();

    if (!title) {
      showError('Title should not be empty');
      input.focus();

      return;
    }

    hideError();
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    createTodo(title)
      .then(createdTodo => {
        setTodos(currentTodos => [
          ...currentTodos,
          createdTodo,
        ]);

        setTempTodo(null);
        input.value = '';
      })
      .catch(() => {
        setTempTodo(null);
        showError('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    hideError();

    setProcessingIds(currentIds => {
      if (currentIds.includes(todoId)) {
        return currentIds;
      }

      return [...currentIds, todoId];
    });

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const idsToDelete = completedTodos.map(todo => todo.id);

    if (idsToDelete.length === 0) {
      return;
    }

    hideError();
    setProcessingIds(idsToDelete);

    const deleteRequests = idsToDelete.map(todoId =>
      deleteTodo(todoId)
        .then(() => ({
          todoId,
          success: true,
        }))
        .catch(() => ({
          todoId,
          success: false,
        })),
    );

    Promise.all(deleteRequests).then(results => {
      const successfulIds = results
        .filter(result => result.success)
        .map(result => result.todoId);

      const hasError = results.some(result => !result.success);

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !successfulIds.includes(todo.id),
        ),
      );

      setProcessingIds([]);

      if (hasError) {
        showError('Unable to delete a todo');
      }

      inputRef.current?.focus();
    });
  };

  const handleHideError = () => {
    hideError();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {!isLoading && (todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={allVisibleTodos}
              processingIds={processingIds}
              onDelete={handleDeleteTodo}
            />

            {todos.length > 0 && (
              <footer
                className="todoapp__footer"
                data-cy="Footer"
              >
                <span
                  className="todo-count"
                  data-cy="TodosCounter"
                >
                  {activeTodos.length} items left
                </span>

                <Filter
                  filter={filter}
                  onFilterChange={setFilter}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={completedTodos.length === 0}
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

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
          onClick={handleHideError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
