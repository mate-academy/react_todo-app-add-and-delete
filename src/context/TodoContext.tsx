import {
  createContext,
  useContext,
  useState,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from 'react';

import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodoContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  filter: Filter.ALL,
  setFilter: () => {},
  error: null,
  setError: () => {},
});

export const useTodoContext = () => useContext(TodoContext);

export const TodoContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        error,
        setError,
        filter,
        setFilter,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
