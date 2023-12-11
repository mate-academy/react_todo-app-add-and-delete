/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessages';
import { getTodos } from '../../api/todos';

export const USER_ID = 12016;

type ContextTodos = {
  todos: Todo[];
  setTodos: (newVlue: Todo[]) => void;
  handleSetError: (err: ErrorMessage) => void;
  isError: ErrorMessage;
  tempTodo: Todo | null;
  setTempTodo: (val: Todo | null) => void;
  tempUpdating: number[];
  setTempUpdating: Dispatch<SetStateAction<number[]>>;
};

export const TodosContext = createContext<ContextTodos>({
  todos: [],
  setTodos: () => {},
  handleSetError: () => {},
  isError: ErrorMessage.NOT_ERROR,
  tempTodo: null,
  setTempTodo: () => {},
  tempUpdating: [0],
  setTempUpdating: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(ErrorMessage.NOT_ERROR);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempUpdating, setTempUpdating] = useState<number[]>([0]);

  let timerId = 0;

  const handleSetError = useCallback((error: ErrorMessage) => {
    window.clearTimeout(timerId);
    setIsError(error);

    timerId = window.setTimeout(() => {
      setIsError(ErrorMessage.NOT_ERROR);
    }, 3000);
  }, []);

  const loadTodos = async () => {
    setIsError(ErrorMessage.NOT_ERROR);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleSetError(ErrorMessage.ON_LOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    isError,
    handleSetError,
    tempTodo,
    setTempTodo,
    tempUpdating,
    setTempUpdating,
  }), [todos, isError, tempTodo, tempUpdating]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
