import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { Error } from '../types/Error';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';
import { Filter } from '../types/Filter';

// const USER_ID = 11886;
// 11902 | 11886

interface GlobalContextType {
  USER_ID: number,

  todos: Todo[],
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void,

  filter: Filter,
  setFilter: (value: Filter) => void,

  filteredTodos: Todo[],
  setFilteredTodos: (value: Todo[]) => void,

  isLoading: boolean,
  setIsLoading: (value: boolean) => void,

  error: Error,
  setError: (value: Error) => void,
  inputRef: React.MutableRefObject<HTMLInputElement | null>;

  tempTodo: Todo | null,
  setTempTodo: (value: Todo | null) => void,

  handleClearCompleted: () => void,
  completedDeliting: boolean,
  setCompletedDeliting: (value: boolean) => void,
}

export const GlobalContext = React.createContext<GlobalContextType>({
  USER_ID: 11902,

  todos: [],
  setTodos: () => { },

  filter: Filter.All,
  setFilter: () => { },

  filteredTodos: [],
  setFilteredTodos: () => { },

  isLoading: false,
  setIsLoading: () => { },

  error: Error.Default,
  setError: () => { },

  inputRef: { current: null },

  tempTodo: null,
  setTempTodo: () => { },

  handleClearCompleted: () => { },

  completedDeliting: false,
  setCompletedDeliting: () => { },

});

export const GlobalProvider = (
  { children }: { children: React.ReactNode },
) => {
  const USER_ID = 11902;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(Error.Default);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedDeliting, setCompletedDeliting] = useState(false);

  const initial = useCallback(
    async () => {
      try {
        const response = await getTodos(USER_ID);

        setTodos(response);
      } catch {
        setError(Error.Load);
      }
    }, [setTodos, setError],
  );

  const clearByOne = async (todo: Todo) => {
    if (todo.completed) {
      try {
        setCompletedDeliting(true);
        await deleteTodo(todo.id);
        setTodos((prev) => prev.filter((el) => el.id !== todo.id));
      } catch (e) {
        setError(Error.Delete);
        setTodos(todos);
      } finally {
        setCompletedDeliting(false);
      }
    }
  };

  const handleClearCompleted = () => {
    todos.map(todo => clearByOne(todo));
  };

  useEffect(() => {
    initial();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    switch (filter) {
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case Filter.All:
      default:
        setFilteredTodos(todos);
    }
  }, [filter, todos, filteredTodos]);

  useEffect(() => {
    if (error) {
      window.setTimeout(() => {
        setError(Error.Default);
      }, 3000);
    }
  }, [error, setError]);

  return (
    <GlobalContext.Provider
      value={{
        USER_ID,
        todos,
        setTodos,
        filter,
        setFilter,
        isLoading,
        setIsLoading,
        filteredTodos,
        setFilteredTodos,
        error,
        setError,
        inputRef,
        tempTodo,
        setTempTodo,
        handleClearCompleted,
        completedDeliting,
        setCompletedDeliting,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
