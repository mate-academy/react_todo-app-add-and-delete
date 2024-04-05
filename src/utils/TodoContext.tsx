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
import { deleteTodoFromServer, getTodos, sendTodoToServer } from '../api/todos';
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

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, 0]);

    sendTodoToServer(newTodo)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessage.ADD_TODO_ERROR);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setLoadingTodosIDs(prev => prev.filter(todoId => todoId !== 0));
      });
  };

  const removeTodo = (id: number) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, id]);
    deleteTodoFromServer(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.DELETE_TODO_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodosIDs(prev => prev.filter(todoId => todoId !== id));
      });
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
