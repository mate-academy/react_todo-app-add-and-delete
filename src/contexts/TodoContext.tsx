import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';

interface TodoContextProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: Filters;
  setFilter: (filter: Filters) => void;
  error: string | null;
  setError: (error: string | null) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  setTodos: () => {},
  filter: Filters.All,
  setFilter: () => {},
  error: null,
  setError: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

export const useTodoContext = () => useContext(TodoContext);

export const TodoContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.All);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        tempTodo,
        setTempTodo,
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
