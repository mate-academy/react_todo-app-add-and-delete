import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

type DeleteResult = {
  id: number;
  success: boolean;
};

// Sentinel id for the optimistic (not-yet-created) todo.
// Negative so it can never collide with a real server id.
const TEMP_TODO_ID = -1;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorHidden, setErrorHidden] = useState(true);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);

  /*
   * Show error notification.
   */
  const showError = useCallback((message: string): void => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    setErrorMessage(message);
    setErrorHidden(false);

    errorTimerRef.current = setTimeout(() => {
      setErrorHidden(true);
      setErrorMessage('');
    }, 3000);
  }, []);

  /*
   * Hide error notification.
   */
  const hideError = useCallback((): void => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setErrorHidden(true);
    setErrorMessage('');
  }, []);

  /*
   * Focus the input after adding is finished.
   */
  useEffect(() => {
    if (!isAdding) {
      newTodoField.current?.focus();
    }
  }, [isAdding]);

  /*
   * Load todos when the application starts.
   */
  useEffect(() => {
    const loadTodos = async (): Promise<void> => {
      hideError();

      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        showError('Unable to load todos');
      }
    };

    loadTodos();

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [hideError, showError]);

  /*
   * Keep the filter in sync with the URL hash so deep-linking
   * and browser back/forward work.
   */
  useEffect(() => {
    const applyFilterFromHash = (): void => {
      const hash = window.location.hash.replace(/^#\/?/, '');

      if (hash === 'active' || hash === 'completed') {
        setFilter(hash);
      } else {
        setFilter('all');
      }
    };

    applyFilterFromHash();
    window.addEventListener('hashchange', applyFilterFromHash);

    return () => {
      window.removeEventListener('hashchange', applyFilterFromHash);
    };
  }, []);

  /*
   * Re-focus the input once the last pending deletion has finished.
   */
  const previousDeletingCount = useRef(0);

  useEffect(() => {
    const currentDeletingCount = deletingTodoIds.length;

    if (previousDeletingCount.current > 0 && currentDeletingCount === 0) {
      newTodoField.current?.focus();
    }

    previousDeletingCount.current = currentDeletingCount;
  }, [deletingTodoIds.length]);

  /*
   * Add a new todo.
   */
  const handleAddTodo = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    hideError();

    setIsAdding(true);

    const newTempTodo: Todo = {
      id: TEMP_TODO_ID,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      setTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  /*
   * Delete one todo.
   */
  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    hideError();

    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  /*
   * Delete all completed todos.
   */
  const handleClearCompleted = async (): Promise<void> => {
    // Skip todos already being deleted individually so we don't
    // remove their ids twice from `deletingTodoIds`.
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id)
      .filter(id => !deletingTodoIds.includes(id));

    if (completedIds.length === 0) {
      return;
    }

    hideError();

    setDeletingTodoIds(currentIds => [
      ...currentIds,
      ...completedIds.filter(id => !currentIds.includes(id)),
    ]);

    const results: DeleteResult[] = await Promise.all(
      completedIds.map(async (id): Promise<DeleteResult> => {
        try {
          await deleteTodo(id);

          return {
            id,
            success: true,
          };
        } catch {
          return {
            id,
            success: false,
          };
        }
      }),
    );

    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    const hasErrors = results.some(result => !result.success);

    if (successfulIds.length > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    setDeletingTodoIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );

    if (hasErrors) {
      showError('Unable to delete a todo');
    }
  };

  /*
   * Filter todos.
   */
  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  /*
   * Counter text. Built with a template literal so JSX whitespace
   * collapsing can never drop the space between the number and "item".
   */
  const todosCounterText = `${activeTodosCount} ${
    activeTodosCount === 1 ? 'item' : 'items'
  } left`;

  /*
   * Show UserWarning when USER_ID is missing.
   */
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/*
           * NOTE: toggling is out of scope for add/delete.
           * Placeholder visual only.
           */}
          <button
            type="button"
            className={`todoapp__toggle-all ${
              todos.length > 0 && todos.every(todo => todo.completed)
                ? 'active'
                : ''
            }`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              const isDeleting = deletingTodoIds.includes(todo.id);

              return (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      aria-label={`Mark "${todo.title}" as completed`}
                      readOnly
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={isDeleting}
                  >
                    ×
                  </button>

                  {/*
                   * IMPORTANT:
                   * TodoLoader must ALWAYS exist.
                   * - normal   : "modal overlay"
                   * - deleting : "modal overlay is-active"
                   */}
                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${isDeleting ? 'is-active' : ''}`}
                  >
                    <div
                      className="modal-background
                      has-background-white-ter"
                    />

                    <div className="loader" />
                  </div>
                </div>
              );
            })}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={false}
                    aria-label="Todo status"
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />

                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounterText}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

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
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorHidden ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
