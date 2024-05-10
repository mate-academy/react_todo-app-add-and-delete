import { createContext, useContext, useState } from 'react';
import { CompletionStatus } from './types/CompletionStatus';
import { Todo } from './types/Todo';
import { countItemsLeft } from './utils/countItemsLeft';

type TodoProviderProps = {
  children: React.ReactNode;
};

type TodosContext = {
  todos: Todo[];
  titleField: string;
  errorMessage: string;
  tempTodo: Todo | null;
  filterByStatus: CompletionStatus;
  loadingItemsIds: number[];
  itemsLeft: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTitleField: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setFilterByStatus: React.Dispatch<React.SetStateAction<CompletionStatus>>;
  setLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  handleError: (errMessage: string) => void;
};

const initialState = {
  todos: [],
  titleField: '',
  errorMessage: '',
  tempTodo: null,
  filterByStatus: CompletionStatus.All,
  loadingItemsIds: [],
  itemsLeft: 0,
  setTodos: () => {},
  setTitleField: () => {},
  setTempTodo: () => {},
  setFilterByStatus: () => {},
  setErrorMessage: () => {},
  handleError: () => {},
  setLoadingItemsIds: () => {},
};

export const TodoContenxt = createContext<TodosContext>(initialState);

export function useTodosContext() {
  return useContext(TodoContenxt);
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleField, setTitleField] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingItemsIds, setLoadingItemsIds] = useState<number[]>([]);
  const [filterByStatus, setFilterByStatus] = useState<CompletionStatus>(
    CompletionStatus.All,
  );

  const itemsLeft = countItemsLeft(todos);

  const handleError = (errMessage: string) => {
    setErrorMessage(errMessage);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  return (
    <TodoContenxt.Provider
      value={{
        todos,
        titleField,
        errorMessage,
        tempTodo,
        filterByStatus,
        loadingItemsIds,
        itemsLeft,
        handleError,
        setTodos,
        setTitleField,
        setTempTodo,
        setFilterByStatus,
        setLoadingItemsIds,
        setErrorMessage,
      }}
    >
      {children}
    </TodoContenxt.Provider>
  );
}
