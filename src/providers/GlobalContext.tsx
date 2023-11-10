import React, {
  useState,
  useRef,
  useEffect,
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

  loadingTodos: Todo[],
  setLoadingTodos: (value: Todo[]) => void,

  tempTodo: Todo | null,
  setTempTodo: (value: Todo | null) => void,

  error: Error,
  setError: (value: Error) => void,

  inputRef: React.MutableRefObject<HTMLInputElement | null>;

  handleDelete: (value: Todo) => void,
}

export const GlobalContext = React.createContext<GlobalContextType>({
  USER_ID: 11902,

  // All todos
  todos: [],
  setTodos: () => { },
  // Filter todos by status
  filter: Filter.All,
  setFilter: () => { },
  // Filtered todos
  filteredTodos: [],
  setFilteredTodos: () => { },
  // Array with todos, wich have to be loaded
  loadingTodos: [],
  setLoadingTodos: () => { },
  // Temporary todo - show bebore create
  tempTodo: null,
  setTempTodo: () => { },
  // Error status
  error: Error.Default,
  setError: () => { },
  // focus method
  inputRef: { current: null },

  // detele func
  handleDelete: () => { },

});

export const GlobalProvider = (
  { children }: { children: React.ReactNode },
) => {
  const USER_ID = 11902;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState(Error.Default);

  // #region initioal_loadong
  const initial = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      setError(Error.Load);
    }
  };

  useEffect(() => {
    initial();
    inputRef.current?.focus();
  }, []);
  // #endregion initioal_loadong

  const handleDelete = async (target: Todo) => {
    try {
      setLoadingTodos((prev) => [...prev, target]);
      const response = await deleteTodo(target.id);

      if (response) {
        setTodos((prev) => prev.filter((todo) => todo.id !== target.id));
      }
    } catch (e) {
      setError(Error.Delete);
      setTodos(todos);
    } finally {
      setLoadingTodos(loadingTodos.filter(todo => todo.id === target.id));
    }
  };

  // #region Filter
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
  // #endregion Filter

  // #region Error
  useEffect(() => {
    if (error) {
      window.setTimeout(() => {
        setError(Error.Default);
      }, 3000);
    }
  }, [error, setError]);
  // #endregion Error

  return (
    <GlobalContext.Provider
      value={{
        USER_ID,

        todos,
        setTodos,

        filter,
        setFilter,

        filteredTodos,
        setFilteredTodos,

        loadingTodos,
        setLoadingTodos,

        tempTodo,
        setTempTodo,

        error,
        setError,

        inputRef,

        handleDelete,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
