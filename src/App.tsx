/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, Filter, ErrorType } from './types/Todo';
import { getTodos, USER_ID, createTodo, deleteTodo } from './api/todos';

import { TodoItem } from './TodoItem';
import { NewTodoForm } from './NewTodoForm';
import { ToggleAllButton } from './ToggleAllButton';
import { Footer } from './Footer';
import { ErrorNotification } from './ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (e) {
        showError(ErrorType.LoadTodos);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [showError]);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [loading]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'Active':
          return !todo.completed;
        case 'Completed':
          return todo.completed;
        case 'All':
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const hasCompletedTodos = useMemo(
    () => todos.some(t => t.completed),
    [todos],
  );
  const isAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );
  const shouldShowList = todos.length > 0 || tempTodo !== null;

  const handleToggleAll = () => {};

  const handleFilterChange = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
  }, []);

  const handleAddTodo = useCallback(
    async (title: string) => {
      clearError();
      const trimmedTitle = title.trim();

      if (trimmedTitle === '') {
        showError(ErrorType.TitleEmpty);

        return;
      }

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });
      setProcessingTodos(prev => [...prev, 0]);

      try {
        const newTodo = await createTodo(trimmedTitle);

        setTodos(prevTodos => [...prevTodos, newTodo]);

        return true;
      } catch (e) {
        showError(ErrorType.AddTodo);

        return false;
      } finally {
        setTempTodo(null);

        setProcessingTodos(prev => prev.filter(id => id !== 0));

        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      }
    },
    [showError, clearError],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      clearError();
      setProcessingTodos(prev => [...prev, todoId]);

      try {
        await deleteTodo(todoId);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch (e) {
        showError(ErrorType.DeleteTodo);
      } finally {
        setProcessingTodos(prev => prev.filter(id => id !== todoId));

        newTodoFieldRef.current?.focus();
      }
    },
    [showError, clearError],
  );

  const handleClearCompleted = useCallback(async () => {
    clearError();
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setProcessingTodos(prev => [...prev, ...completedTodos.map(t => t.id)]);

    const deletionPromises = completedTodos.map(async todo => {
      try {
        await deleteTodo(todo.id);

        return { id: todo.id, success: true };
      } catch (e) {
        showError('Unable to delete a todo');

        return { id: todo.id, success: false };
      } finally {
        //setProcessingTodos(prev => prev.filter(id => id !== todo.id));
      }
    });

    const results = await Promise.all(deletionPromises);

    const successfulIds = results.filter(res => res.success).map(res => res.id);

    setProcessingTodos(prev => prev.filter(id => !successfulIds.includes(id)));

    setTodos(prevTodos =>
      prevTodos.filter(
        todo => !results.some(res => res.id === todo.id && res.success),
      ),
    );

    newTodoFieldRef.current?.focus();
  }, [todos, showError, clearError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (loading && todos.length === 0) {
    return <div className="loader">Loading todos...</div>;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleAllButton
            isAllCompleted={isAllCompleted}
            todosCount={todos.length}
            onToggleAll={handleToggleAll}
          />
          <NewTodoForm
            onCreate={handleAddTodo}
            fieldRef={newTodoFieldRef}
            disabled={processingTodos.includes(0)}
          />
        </header>

        {shouldShowList && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteTodo}
                isLoading={processingTodos.includes(todo.id)}
              />
            ))}
            {tempTodo && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                onDelete={() => {}}
                isLoading={true}
              />
            )}
          </section>
        )}

        {shouldShowList && (
          <Footer
            activeTodosCount={activeTodosCount}
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} clearError={clearError} />
    </div>
  );
};
