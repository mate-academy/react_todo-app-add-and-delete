import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  getTodos,
  postTodo,
  deleteTodo,
  USER_ID,
  getFilteredTodos,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Notifications } from './Components/Notifications';
import { FilterType } from './types/FilterType';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedTodos, setProcessedTodos] = useState<number[]>([]);

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, filterType)
  ), [todos, filterType]);

  const completedTodos = useMemo(() => (
    getFilteredTodos(todos, FilterType.COMPLETED)
  ), [todos]);

  const loadTodos = async () => {
    setError(null);

    try {
      const todoList = await getTodos(USER_ID);

      setTodos(todoList);
    } catch {
      setError(ErrorTypes.LOAD);
    }
  };

  const handleAddTodo = async (newTitle: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!newTitle.trim()) {
        setError(ErrorTypes.INPUT);
        setIsLoading(false);

        return;
      }

      if (USER_ID) {
        setTempTodo({
          id: 0,
          userId: USER_ID,
          title: newTitle,
          completed: false,
        });

        const newTodo = await postTodo({
          userId: USER_ID,
          title: newTitle,
          completed: false,
        });

        setTodos(prevTodo => [...prevTodo, newTodo]);
      }
    } catch {
      setError(ErrorTypes.ADD);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      setProcessedTodos(removeTodos => [...removeTodos, todoId]);
      setError(null);

      try {
        await deleteTodo(todoId);

        setTodos(allTodos => allTodos.filter(todo => todo.id !== todoId));
      } catch {
        setError(ErrorTypes.DELETE);
      } finally {
        setProcessedTodos(removeTodo => removeTodo
          .filter(id => id !== todoId));
      }
    }, [processedTodos],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createdTodo={handleAddTodo}
          isLoading={isLoading}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          processedTodos={processedTodos}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            completedTodos={completedTodos}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      {error && (
        <Notifications
          setError={setError}
          error={error}
        />
      )}
    </div>
  );
};
