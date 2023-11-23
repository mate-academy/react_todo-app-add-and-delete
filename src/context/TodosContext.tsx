import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../enums/Status';
import { getTodos } from '../api/todos';

type ProviderProps = {
  children: React.ReactNode,
};

type ContextType = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  status: Status,
  setStatus: React.Dispatch<React.SetStateAction<Status>>,
  error: Error,
  setError: React.Dispatch<React.SetStateAction<Error>>,
  setErrorTimeout: () => void,
  processingTodos: number[],
  setProcessingTodos: React.Dispatch<React.SetStateAction<number[]>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
};

type Error = {
  message: string,
  isError: boolean,
};

const initialValue: ContextType = {
  todos: [],
  setTodos: () => {},
  status: Status.All,
  setStatus: () => {},
  error: { message: '', isError: false },
  setError: () => {},
  setErrorTimeout: () => {},
  processingTodos: [],
  setProcessingTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
};

const initAutoHideErrorTimeoutSetter
= (setError: React.Dispatch<React.SetStateAction<Error>>) => {
  let TIMEOUT_ID: NodeJS.Timeout;

  return () => {
    clearTimeout(TIMEOUT_ID);
    TIMEOUT_ID
    = setTimeout(() => setError(error => ({ ...error, isError: false })), 3000);
  };
};

export const TodosContext = React.createContext<ContextType>(initialValue);

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [error, setError] = useState({ message: '', isError: false });
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const setErrorTimeout
  = useCallback(initAutoHideErrorTimeoutSetter(setError), []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    status,
    setStatus,
    error,
    setError,
    setErrorTimeout,
    processingTodos,
    setProcessingTodos,
    tempTodo,
    setTempTodo,
  }), [tempTodo, processingTodos, setErrorTimeout,
    todos, error, status, setTodos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError({ message: 'Unable to load todos', isError: true });
        setErrorTimeout();
      });
  }, [setErrorTimeout]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
