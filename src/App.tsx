import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as todosApi from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [newTitle, setNewTitle] = useState('');
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  // Error handling
  const hideError = useCallback(() => {
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }

    setError(null);
  }, []);

  const showError = useCallback((msg: string) => {
    setError(msg);
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = window.setTimeout(() => setError(null), 3000);
  }, []);

  // Load
  useEffect(() => {
    setIsLoading(true);
    hideError();

    todosApi
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.UnableToLoadTodos))
      .finally(() => setIsLoading(false));

    return () => {
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, [hideError, showError]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => inputRef.current?.focus(), 0);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Derived data
  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterStatus.Active:
        return todos.filter(t => !t.completed);
      case FilterStatus.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const allCompleted = todos.length > 0 && activeCount === 0;

  // Handlers
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      showError(ErrorMessage.TitleShouldNotBeEmpty);

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: todosApi.USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);
    setIsLoading(true);
    hideError();

    todosApi
      .addTodo(title)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTitle('');
      })
      .catch(() => showError(ErrorMessage.UnableToAddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        inputRef.current?.focus();
      });
  };

  const handleDelete = async (todoId: number) => {
    setPendingIds(prev => (prev.includes(todoId) ? prev : [...prev, todoId]));
    try {
      await todosApi.deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
      inputRef.current?.focus();
    } catch {
      showError(ErrorMessage.UnableToDeleteTodo);
    } finally {
      setPendingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);
    hideError();

    const results = await Promise.allSettled(
      completedTodos.map(todo =>
        todosApi.deleteTodo(todo.id).then(() => todo.id),
      ),
    );

    const successfulIds = results
      .filter(
        (r): r is PromiseFulfilledResult<number> => r.status === 'fulfilled',
      )
      .map(r => r.value);

    setTodos(prev => prev.filter(t => !successfulIds.includes(t.id)));

    const hasErrors = results.some(r => r.status === 'rejected');

    if (hasErrors) {
      showError(ErrorMessage.UnableToDeleteTodo);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  // Render
  if (!todosApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            disabled={!todos.length}
            aria-label="Toggle all"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={isLoading}
              data-cy="NewTodoField"
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          pendingIds={pendingIds}
          onDelete={handleDelete}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </span>

            <Filter filter={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(t => t.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification message={error} onHide={hideError} />
    </div>
  );
};
