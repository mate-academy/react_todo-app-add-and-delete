import React, {
  createContext,
  useContext,
  useState,
  FC,
  useEffect,
} from 'react';
import { Todo } from '../types/Todo';
import { TodosContextType } from '../types/TodosContextType';
import { Filter } from '../types/Filter';
import { getTodos, sendTodoToServer } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

const initialTodos: Todo[] = [];

const TodosContext = createContext<TodosContextType>({
  todos: initialTodos,
  filter: Filter.ALL,
  addTodo: () => {},
  removeTodo: () => {},
  setTodos: () => {},
  setFilter: () => {},
  query: '',
  setQuery: () => {},
  error: ErrorMessage.NO_ERRORS,
  setError: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loadingTodosIDs: [],
  setLoadingTodosIDs: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.NO_ERRORS);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingTodosIDs, setLoadingTodosIDs] = React.useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const addTodo = (newTodo: Todo) => {
    // setTodos(prevTodos => [...prevTodos, newTodo]);
    sendTodoToServer(newTodo);
  };

  const removeTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError(ErrorMessage.UNABLE_LOAD_TODOS);
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
        setFilter,
        filter,
        query,
        setQuery,
        error,
        setError,
        isLoading,
        setIsLoading,
        loadingTodosIDs,
        setLoadingTodosIDs,
        tempTodo,
        setTempTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
