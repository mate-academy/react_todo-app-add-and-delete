import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { ErrorList } from '../types/ErrorList';
import { Status } from '../types/Status';
import { wait } from '../utils/fetchClient';
import { deleteTodo, getTodos } from '../api/todos';

export type TodoContext = {
  todos: Todo[];
  preparedTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  errorMessage: ErrorList | string;
  setErrorMessage: Dispatch<SetStateAction<ErrorList | string>>;
  status: Status;
  setStatus: (value: Status) => void;
  handleError: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  focusInput: () => void;
  handleDeleteTodo: (ItemId: number) => void;
  processingIds: number[];
  setProcessingIds: (value: number[]) => void;
  contextInputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodosContext = createContext<TodoContext | undefined>(undefined);

export const useTodosContext = () => {
  const context = useContext(TodosContext);

  if (context === undefined) {
    throw new Error('Error');
  }

  return context;
};

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorList | string>('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const contextInputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);

    return wait(3000).then(() => setErrorMessage(''));
  };

  useEffect(() => {
    contextInputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorList.LoadTodos);
      });
  }, []);

  const focusInput = () => {
    contextInputRef.current?.focus();
  };

  const handleDeleteTodo = (ItemId: number) => {
    setProcessingIds(prevIds => [...prevIds, ItemId]);

    deleteTodo(ItemId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(values => values.id !== ItemId));
      })
      .catch(() => {
        handleError(ErrorList.DeleteTodo);
      })
      .finally(() => {
        focusInput();
        setProcessingIds(prevIds => prevIds.filter(id => id !== ItemId));
      });
  };

  const preparedTodos = useMemo(() => {
    switch (status) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  const value = {
    tempTodo,
    setTempTodo,
    handleError,
    preparedTodos,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    status,
    setStatus,
    isLoading,
    setIsLoading,

    focusInput,
    handleDeleteTodo,
    processingIds,
    setProcessingIds,
    contextInputRef,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
