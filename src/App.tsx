/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoForm } from './components/TodoForm';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoCounter } from './components/TodoCounter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [filter, setFilter] = useState('all');
  const [errorTimerId, setErrorTimerId] = useState<NodeJS.Timeout | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // Видаляємо стан todoAdded, оскільки він нам більше не потрібен
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);

  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  const loadTodos = useCallback(async () => {
    setLoadingTodos(true);
    setError('');

    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch (e) {
      setError('Unable to load todos');
    } finally {
      setLoadingTodos(false);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const areAllTodosCompleted = useMemo(() => {
    return todos.length > 0 && todos.every(todo => todo.completed);
  }, [todos]);

  const hideError = useCallback(() => {
    setError('');
    if (errorTimerId) {
      clearTimeout(errorTimerId);
      setErrorTimerId(null);
    }
  }, [errorTimerId]);

  useEffect(() => {
    if (!USER_ID) {
      setError('USER_ID is not set. Please set your USER_ID in api/todos.ts');

      return;
    }

    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (error && !errorTimerId) {
      const timerId = setTimeout(() => {
        setError('');
        setErrorTimerId(null);
      }, 3000);

      setErrorTimerId(timerId);
    }

    return () => {
      if (errorTimerId) {
        clearTimeout(errorTimerId);
      }
    };
  }, [error, errorTimerId]);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, []);

  // Видаляємо useEffect з todoAdded, оскільки переносимо логіку в handleAddTodo

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      if (newTodoInputRef.current) {
        newTodoInputRef.current.focus();
      }

      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Title is too long! Please keep it under 100 characters.');

      return;
    }

    setIsSubmitting(true);
    const tempTodoItem: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempTodoItem);

    try {
      const createdTodo = await createTodo(trimmedTitle);

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoTitle('');

      // Переносимо логіку фокусування сюди
      setTimeout(() => {
        if (newTodoInputRef.current) {
          newTodoInputRef.current.focus();
        }
      }, 0);
    } catch (err) {
      setError('Unable to add a todo');
      setTimeout(() => {
        if (newTodoInputRef.current) {
          newTodoInputRef.current.focus();
        }
      }, 0);
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodos(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
      setTimeout(() => {
        if (newTodoInputRef.current) {
          newTodoInputRef.current.focus();
        }
      }, 0);
    } catch (err) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleUpdateTodo = async (todoId: number, completed: boolean) => {
    try {
      await updateTodo(todoId, { completed });
      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, completed } : t)),
      );
    } catch (err) {
      setError('Unable to update todo');
    }
  };

  const toggleAllTodos = async () => {
    const shouldCompleteAll = !areAllTodosCompleted;

    try {
      const updatedTodos = await Promise.all(
        todos.map(todo =>
          todo.completed !== shouldCompleteAll
            ? updateTodo(todo.id, { completed: shouldCompleteAll })
            : Promise.resolve(todo),
        ),
      );

      setTodos(updatedTodos);
    } catch (err) {
      setError('Unable to update all todos');
    }
  };

  const clearCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      setDeletingTodos(completedTodos.map(todo => todo.id));

      const results = await Promise.allSettled(
        completedTodos.map(todo =>
          deleteTodo(todo.id)
            .then(() => ({ success: true, id: todo.id }))
            .catch(() => ({ success: false, id: todo.id })),
        ),
      );

      const successfulDeletions = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(
          result =>
            (result as PromiseFulfilledResult<{ success: boolean; id: number }>)
              .value.id,
        );

      const hasFailures = results.some(
        result => result.status === 'fulfilled' && !result.value.success,
      );

      if (hasFailures) {
        setError('Unable to delete a todo');
      }

      setTodos(prev =>
        prev.filter(todo => !successfulDeletions.includes(todo.id)),
      );
      setDeletingTodos([]);

      setTimeout(() => {
        if (newTodoInputRef.current) {
          newTodoInputRef.current.focus();
        }
      }, 0);
    } catch (err) {
      setError('Unable to clear completed todos');
      setDeletingTodos([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {loadingTodos && todos.length === 0 && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={toggleAllTodos}
          />

          <TodoForm
            newTodoTitle={newTodoTitle}
            isSubmitting={isSubmitting}
            newTodoInputRef={newTodoInputRef}
            setNewTodoTitle={setNewTodoTitle}
            handleAddTodo={handleAddTodo}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deletingTodos={deletingTodos}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <TodoCounter count={activeTodosCount} />

              <TodoFilter filter={filter} setFilter={setFilter} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompletedTodos}
                onClick={clearCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={hideError} />
    </div>
  );
};
