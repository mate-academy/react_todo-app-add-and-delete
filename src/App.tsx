import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessages, FilterStates } from './types/enums';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages>(ErrorMessages.DEFAULT);
  const [filter, setFilter] = useState(FilterStates.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      setError(ErrorMessages.LOAD_TODOS);
      setTimeout(() => {
        setError(ErrorMessages.DEFAULT);
      }, 3000);
    }
  }, []);

  const handleAddTodo = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTempTodo);

      const newTodo = await addTodo(title.trim());

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTempTodo(null);
      setTitle('');
    } catch {
      setError(ErrorMessages.ADDING_TODOS);
      setTempTodo(null);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [title]);

  const handleDeleteTodo = useCallback(
    async (todoId: number): Promise<void> => {
      try {
        await deleteTodo(todoId);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch {
        setError(ErrorMessages.DELETING_TODOS);
      } finally {
        inputRef.current?.focus();
      }
    },
    [],
  );

  const handleHideError = () => {
    setError(ErrorMessages.DEFAULT);
  };

  const handleClearCompleted = useCallback(async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      const deletionResults = await Promise.allSettled(
        completedTodos.map(todo => handleDeleteTodo(todo.id)),
      );

      const hasErrors = deletionResults.some(
        result => result.status === 'rejected',
      );

      if (hasErrors) {
        setError(ErrorMessages.DELETING_SOME_TODOS);
      }
    } catch {
      setError(ErrorMessages.COMPLETED_TODOS);
    } finally {
      inputRef.current?.focus();
    }
  }, [handleDeleteTodo, todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStates.ACTIVE:
          return !todo.completed;
        case FilterStates.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const hasTodos = todos.length > 0;
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(ErrorMessages.DEFAULT);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          allCompleted={allCompleted}
          onAddTodo={handleAddTodo}
          isLoading={isLoading}
          setError={setError}
          setIsLoading={setIsLoading}
          title={title}
          setTitle={setTitle}
        />
        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            onDelete={handleDeleteTodo}
            isLoading={false}
            setIsLoading={setIsLoading}
            isDeleting={false}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isLoading={isLoading}
          />
        )}
        {hasTodos && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} onHideError={handleHideError} />
    </div>
  );
};
