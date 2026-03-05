/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo, USER_ID } from './api/todos';
import { NewTodoForm } from './components/NewTodoForm';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter, FILTERS } from './types/Filters';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterComponent } from './components/FilterComponent';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const todoFieldRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  // Focus the input field
  const focusField = useCallback(() => {
    todoFieldRef.current?.focus();
  }, []);

  // Refocus input whenever temporary todo changes
  useEffect(() => {
    focusField();
  }, [tempTodo, focusField]);

  // Display error message and hide it automatically after 3 seconds
  const showError = (message: string) => {
    setError(message);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = window.setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Load todos from API when the component mounts
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));

    // Cleanup timeout on unmount
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Memoized calculations for derived todo lists
  const { activeTodos, completedTodos, filteredTodos } = useMemo(() => {
    const active = todos.filter(t => !t.completed);
    const completed = todos.filter(t => t.completed);
    let filtered = todos;

    if (filter === FILTERS.active) {
      filtered = active;
    }

    if (filter === FILTERS.completed) {
      filtered = completed;
    }

    return {
      activeTodos: active,
      completedTodos: completed,
      filteredTodos: filtered,
    };
  }, [todos, filter]);

  // Add new todo
  const handleAdd = async (title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return false;
    }

    // Optimistic UI: show temporary todo while request is in progress
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await createTodo({ title: trimmedTitle });

      setTodos(current => [...current, newTodo]);

      return true;
    } catch {
      showError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  // Delete a todo
  const handleDelete = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(lid => lid !== id));
    }
  };

  // Remove all completed todos
  const handleClearCompleted = async () => {
    await Promise.allSettled(completedTodos.map(todo => handleDelete(todo.id)));
    focusField();
  };

  // If USER_ID is missing, show warning instead of the app
  if (!USER_ID) {
    return <UserWarning />;
  }

  // Derived UI states
  const isAllCompleted = todos.length > 0 && activeTodos.length === 0;
  const hasTodos = todos.length > 0 || tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodoForm
            onAdd={handleAdd}
            loading={!!tempTodo}
            todoFieldRef={todoFieldRef}
          />
        </header>

        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={handleDelete}
          />
        )}

        {/* Footer */}
        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {/*eslint-disable-next-line max-len*/}
              {activeTodos.length} {activeTodos.length === 1 ? 'item' : 'items'}{' '}
              left
            </span>
            <FilterComponent current={filter} onChange={setFilter} />
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
      </div>
      <ErrorNotification message={error} onClose={() => setError(null)} />
    </div>
  );
};
