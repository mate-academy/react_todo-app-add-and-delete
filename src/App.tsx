/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

/**
 * Main Application Component
 * Manages the state and core logic for the Todo App
 */
export const App: React.FC = () => {
  // Core state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  // Add todo state
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  // Delete state - tracks which todo ids are currently loading
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  // Ref to manage input focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial fetch of todos from the API on mount
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  // Auto-focus the input on mount and after add/delete operations
  useEffect(() => {
    if (!isAddingTodo) {
      inputRef.current?.focus();
    }
  }, [isAddingTodo, todos]);

  const handleCloseError = useCallback(() => {
    setErrorMessage('');
  }, []);

  // Memoized filtered todos based on the current filter status
  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  // Helper counts and flags derived from the todos list
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  // Handler to add a new todo
  const handleAddTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = newTodoTitle.trim();

      // Clear any previous error first
      setErrorMessage('');

      if (!trimmedTitle) {
        setErrorMessage('Title should not be empty');

        return;
      }

      setIsAddingTodo(true);

      // Create a temporary todo to show in the list with a loader
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      addTodo(trimmedTitle)
        .then(createdTodo => {
          setTodos(currentTodos => [...currentTodos, createdTodo]);
          setNewTodoTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsAddingTodo(false);
        });
    },
    [newTodoTitle],
  );

  // Handler to delete a single todo
  const handleDeleteTodo = useCallback((todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
      });
  }, []);

  // Handler to clear all completed todos
  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [todos, handleDeleteTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Form for adding new todos */}
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isAddingTodo}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDeleteTodo}
            />

            {tempTodo && <TodoItem todo={tempTodo} isLoading />}

            <TodoFooter
              activeTodosCount={activeTodosCount}
              filterStatus={filterStatus}
              hasCompletedTodos={hasCompletedTodos}
              onFilterChange={setFilterStatus}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={handleCloseError}
      />
    </div>
  );
};
