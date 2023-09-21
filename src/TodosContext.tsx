import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Filter } from './types/Filter';

interface TodosContextType {
  filteredTodos: Todo[],
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  error: string;
  setError: (error: string) => void;
  filter: Filter,
  setFilter: (filter: Filter) => void;
  USER_ID: number;
  loadTodos: () => void;
  tempTodos: Todo[];
  setTempTodos: (todos: Todo[]) => void;
}

type Props = {
  children: React.ReactNode,
};

const USER_ID = 11478;

export const TodosContext = createContext({} as TodosContextType);

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodos, setTempTodos] = useState<Todo[]>([] as Todo[]);
  const [error, setError] = useState('');

  const filteredTodos: Todo[] = useMemo(() => todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.Active:
        return !completed;
      case Filter.Completed:
        return completed;
      default:
        return true;
    }
  }), [filter, todos]);

  const loadTodos = async () => {
    try {
      setError('');
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch {
      setError('Unable to load todos');
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const value = {
    todos,
    setTodos,
    error,
    setError,
    filter,
    setFilter,
    filteredTodos,
    USER_ID,
    loadTodos,
    tempTodos,
    setTempTodos,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  return useContext(TodosContext);
};
