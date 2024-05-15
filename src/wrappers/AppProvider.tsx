/* eslint-disable @typescript-eslint/indent */
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorType, ITempTodo, StatusSelect, Todo } from '../types';

import { getFilteredTodos, getTodos } from '../helpers';

interface IAppProvider {
  children: ReactNode;
}
interface AppContextProps {
  todos: Todo[];
  filteredTodo: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  status: StatusSelect;
  setStatus: Dispatch<SetStateAction<StatusSelect>>;
  errorType: ErrorType | null;
  setErrorType: Dispatch<SetStateAction<ErrorType | null>>;
  tempTodo: ITempTodo;
  setTempTodo: Dispatch<SetStateAction<ITempTodo>>;
  todoDeleteId: number[] | null;
  setTodoDeleteId: Dispatch<SetStateAction<null | number[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const AppContext = createContext<AppContextProps>({
  todos: [],
  filteredTodo: [],
  setTodos: () => {},
  status: StatusSelect.All,
  setStatus: () => {},
  errorType: null,
  setErrorType: () => {},
  tempTodo: {
    isLoading: false,
    todo: null,
  },
  setTempTodo: () => {},
  todoDeleteId: null,
  setTodoDeleteId: () => {},
  inputRef: { current: null },
});

export const AppProvider: FC<IAppProvider> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<StatusSelect>(StatusSelect.All);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<ITempTodo>({
    isLoading: false,
    todo: { id: 0, title: '', completed: false },
  });
  const [todoDeleteId, setTodoDeleteId] = useState<number[] | null>(null);
  const filteredTodo = getFilteredTodos(todos, status);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const result = await getTodos();

        setTodos(result);
      } catch (er) {
        setErrorType('load');
      }
    };

    fetchTodo();
  }, [errorType, tempTodo, setErrorType, setTodos]);

  return (
    <AppContext.Provider
      value={{
        todos,
        filteredTodo,
        setTodos,
        status,
        setStatus,
        errorType,
        setErrorType,
        tempTodo,
        setTempTodo,
        todoDeleteId,
        setTodoDeleteId: setTodoDeleteId as Dispatch<
          SetStateAction<number[] | null>
        >,
        inputRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
