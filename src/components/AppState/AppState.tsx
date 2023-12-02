import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { StatusFilter, Todo } from '../../types/Todo';
import { handleErrorMessage } from '../function/handleErrorMessage ';
import { getTodos } from '../../api/todos';

export const USER_ID = 11956;

type AppStateContextType = {
  todos: Todo[] | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[] | null>>;
  todosFilter: Todo[] | null;
  setTodosFilter: React.Dispatch<React.SetStateAction<Todo[] | null>>;
  errorNotification: string | null;
  setErrorNotification: React.Dispatch<React.SetStateAction<string | null>>;
  filter: StatusFilter;
  setFilter: React.Dispatch<React.SetStateAction<StatusFilter>>;
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined,
);

type AppStateProviderProps = {
  children: ReactNode;
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }

  return context;
};

export const AppStateProvider: React.FC<AppStateProviderProps>
= ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [
    errorNotification,
    setErrorNotification,
  ] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.All);
  const [todosFilter, setTodosFilter] = useState<Todo[] | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      let todoList;

      try {
        setErrorNotification(null);

        todoList = await getTodos(USER_ID);

        setTodos(...[todoList]);
        setTodosFilter(...[todoList]);
      } catch (error) {
        handleErrorMessage(error, setErrorNotification);
        const errorNotificationTimeout = setTimeout(() => {
          setErrorNotification(null);
        }, 3000);

        return () => {
          clearTimeout(errorNotificationTimeout);
        };
      }

      return undefined;
    };

    fetchTodos();
  }, []);

  // const {
  //   todos,
  //   setTodos,
  //   errorNotification,
  //   setErrorNotification,
  //   filter,
  //   setFilter,
  // } = useAppState();

  return (
    <AppStateContext.Provider
      value={{
        todos,
        setTodos,
        errorNotification,
        setErrorNotification,
        filter,
        setFilter,
        todosFilter,
        setTodosFilter,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
