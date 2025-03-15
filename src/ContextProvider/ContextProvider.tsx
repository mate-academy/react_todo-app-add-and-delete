import { createContext, FC, ReactNode, useState } from 'react';
import { Filter } from '../components/Footer/types';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

type MainContextType = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  error: ErrorType;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
};

export const MainContext = createContext<MainContextType>({
  filter: 'FilterLinkAll',
  setFilter: () => {},
  loadingIds: [],
  setLoadingIds: () => {},
  todos: [],
  setTodos: () => {},
  tempTodo: {
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  },
  setTempTodo: () => {},
  error: {
    isVisible: false,
    type: 'emptyTitle',
  },
  setError: () => {},
});

const MainContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState<Filter>('FilterLinkAll');
  const [loadingIds, setLoadingIds] = useState([0]);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorType>({
    isVisible: false,
    type: 'emptyTitle',
  });

  if (error.isVisible) {
    setTimeout(() => {
      setError({
        isVisible: false,
        type: '',
      });
    }, 3000);
  }

  const values = {
    filter,
    setFilter,
    loadingIds,
    setLoadingIds,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    error,
    setError,
  };

  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
};

export default MainContextProvider;
