import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import { UserWarning } from '../../UserWarning';

interface Context {
  todos: Todo[],
  visibleTodos: Todo[],
  isLoading: { [key: number]: boolean },
  setLoading: (value: number) => void,
  isHiddenError: boolean,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setIsHiddenError: (value: boolean) => void
  setFilterType: (value: SortType) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  hasErrorMessage: string,
  setHasErrorMessage: (value: string) => void,
}

export const TodosContext = React.createContext<Context>({
  todos: [],
  setTodos: () => { },
  visibleTodos: [],
  isLoading: {},
  setLoading: () => { },
  setFilterType: () => { },
  isHiddenError: false,
  setIsHiddenError: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  hasErrorMessage: '',
  setHasErrorMessage: () => {},
});

interface Props {
  children: ReactNode;
}

export const USER_ID = 11537;

export enum SortType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [hasErrorMessage, setHasErrorMessage] = useState('');
  const [isHiddenError, setIsHiddenError] = useState(false);

  const [filterType, setFilterType] = useState(SortType.All);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => {
        setTodos(response);
      })
      .catch(() => {
        setIsHiddenError(true);
        setHasErrorMessage('Unable to load todos');
        setTimeout(() => {
          setIsHiddenError(false);
        }, 3000);
      });
  }, []);

  const setLoading = (key: number) => {
    setIsLoading((prevLoadingKeys) => ({
      ...prevLoadingKeys,
      [key]: true,
    }));
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case SortType.Active:
        return todos.filter(todo => todo.completed === false);

      case SortType.Completed:
        return todos.filter(todo => todo.completed === true);

      default:
        return todos;
    }
  }, [filterType, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosContext.Provider
      value={{
        todos,
        visibleTodos,
        isLoading,
        isHiddenError,
        tempTodo,
        hasErrorMessage,
        setIsHiddenError,
        setLoading,
        setFilterType,
        setTodos,
        setTempTodo,
        setHasErrorMessage,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
