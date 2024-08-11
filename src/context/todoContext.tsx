import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Todo } from '../types/Todo/Todo';
import { getTodos } from '../api/todos';
import { ErrorMessages } from '../types/ErrorMessages/ErrorMessages';
import { Filters } from '../types/Filters/Filters';
import { getFiltedTodos } from '../utils/helpers/filterService';

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);

export interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: Filters;
  loadingTodoIds: number[] | null;
  editTodoId: number | null;
  todoTemp: string | null;
  errorMessage: ErrorMessages | string;
  lockedFocus: boolean;
  setLockedFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setTodoTemp: React.Dispatch<React.SetStateAction<string | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages | string>>;
  setFilter: React.Dispatch<React.SetStateAction<Filters>>;
  showError: (error: ErrorMessages | string) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[] | null>>;
}

interface ProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<ProviderProps> = ({
  children,
}): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | string>('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[] | null>(null);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [todoTemp, setTodoTemp] = useState<string | null>(null);
  const [lockedFocus, setLockedFocus] = useState(false);

  const showError = useCallback((error: ErrorMessages | string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    setLockedFocus(true);
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        showError(ErrorMessages.Load);
      }
    };

    loadTodos();
  }, [showError]);

  const filteredTodos = useMemo(
    () => getFiltedTodos(todos, filter),
    [filter, todos],
  );

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        filteredTodos,
        setFilter,
        filter,
        errorMessage,
        setErrorMessage,
        showError,
        setLoadingTodoIds,
        loadingTodoIds,
        editTodoId,
        setEditTodoId,
        setTodoTemp,
        todoTemp,
        lockedFocus,
        setLockedFocus,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
