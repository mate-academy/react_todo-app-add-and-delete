import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CurrentError } from '../types/CurrentError';
import { getTodos, deleteTodo, addTodo } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { Todo } from '../types/Todo';

type Props = {
  children: React.ReactNode
};

export const TodoContext = createContext({
  todos: [] as Todo[],
  addTodoHandler: (_newTodo: Omit<Todo, 'id'>) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
  deleteTodoHandler: (_todoId: number) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
  error: CurrentError.Default,
  setError: (_error: CurrentError) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
  isLoading: false,
  setIsLoading: (_value: boolean) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(CurrentError.Default);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(CurrentError.LoadingError);
      });
  }, []);

  const addTodoHandler = (newTodo: Omit<Todo, 'id'>) => {
    addTodo(USER_ID, newTodo)
      .then(createdTodo => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      });
  };

  const deleteTodoHandler = useCallback((todoId: number): Promise<void> => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => setError(CurrentError.DeleteError))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(() => ({
    todos,
    error,
    isLoading,
    setError,
    addTodoHandler,
    deleteTodoHandler,
    setIsLoading,
  }), [todos]);

  return (
    <TodoContext.Provider
      value={value}
    >
      {children}
    </TodoContext.Provider>
  );
};
