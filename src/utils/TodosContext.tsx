import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Error, Filter, Todo, TodoContextType } from '../types';
import { deleteTodo, getTodos, postTodo } from '../api/todos';

const initialValue: Todo[] = [];

const TodosContext = createContext<TodoContextType>({
  todos: initialValue,
  setTodos: () => {},
  addTodo: () => {},
  removeTodo: () => {},
  filter: Filter.All,
  setFilter: () => {},
  query: '',
  setQuery: () => {},
  error: Error.NO_ERROR,
  setError: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loadingTodosIds: [],
  setLoadingTodosIds: () => {},
});

type Props = {
  children: ReactNode;
};

export const TodosProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(Error.NO_ERROR);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, 0]);

    postTodo(newTodo)
      .then(res => {
        setTodos(prevTodos => [...prevTodos, res]);
        setQuery('');
      })
      .catch(() => {
        setError(Error.UNABLE_TO_ADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setLoadingTodosIds(prevTodos =>
          prevTodos.filter(todoId => todoId !== 0),
        );
      });
  };

  const removeTodo = (id: number) => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(Error.UNABLE_TO_DELETE);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodosIds(prevTodos =>
          prevTodos.filter(todoId => todoId !== id),
        );
      });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError(Error.UNABLE_TO_LOAD);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        removeTodo,
        filter,
        setFilter,
        query,
        setQuery,
        error,
        setError,
        isLoading,
        setIsLoading,
        tempTodo,
        setTempTodo,
        loadingTodosIds,
        setLoadingTodosIds,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
