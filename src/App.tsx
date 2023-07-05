/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoContent } from './components/Content/TodoContent';
import { ErrorNotification } from './components/Notification/ErrorNotification';
import { FilterStatus } from './helper';

const USER_ID = 10888;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodos] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterCondition, setFilterCondition] = useState(FilterStatus.ALL);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [removingTodoId, setRemovingTodoId] = useState(0);

  useEffect(() => {
    const loadTodosByUser = async () => {
      try {
        const uploadedTodos = await getTodos(USER_ID);

        setTodos(uploadedTodos);
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        throw new Error('erroooooor');
      }
    };

    loadTodosByUser();

    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const activeTodosQuantity = todos.filter(todo => !todo.completed).length;

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodos({
        id: 0,
        ...newTodo,
      });

      setIsLoading(true);
      const result = await createTodo(newTodo);

      setIsLoading(false);

      setTodos((prev) => [...prev, result]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodos(null);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setRemovingTodoId(todoId);

      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setRemovingTodoId(0);
    }
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => {
      switch (filterCondition) {
        case FilterStatus.ACTIVE:
          return !todo.completed;
        case FilterStatus.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterCondition]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        todos={filteredTodos}
        initialTodos={todos}
        activeTodosQuantity={activeTodosQuantity}
        filter={filterCondition}
        onFilterChange={setFilterCondition}
        query={query}
        onQueryChange={setQuery}
        addTodo={addTodo}
        isLoading={isLoading}
        tempTodo={tempTodo}
        onErrorMessageChange={setErrorMessage}
        setIsLoading={setIsLoading}
        removeTodo={removeTodo}
        removingTodoId={removingTodoId}
      />

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onHandleError={setErrorMessage}
        />
      )}
    </div>
  );
};
