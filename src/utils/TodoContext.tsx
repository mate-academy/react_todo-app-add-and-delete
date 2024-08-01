import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ErrorType } from '../types/ErrorType';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import { useFetchTodos } from '../hooks/useFetchTodos';
import { useFilteredTodos } from '../hooks/useFilteredTodos';
import { useErrorState } from '../hooks/useErrorState';
import { useInputFocus } from '../hooks/useInputFocus';

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredTodos: Todo[];
  filter: FilterType;
  error: ErrorType | null;
  clearCompletedError: ErrorType | null; // Dodaj clearCompletedError do kontekstu
  setFilter: (filter: FilterType) => void;
  setError: (error: ErrorType | null) => void;
  setClearCompletedError: (error: ErrorType | null) => void; // Funkcja do ustawiania błędu
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
  triggerFocus: () => void;
};

type TodoProviderProps = {
  children: ReactNode;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const {
    todos: initialTodos,
    error: fetchError,
    setError: setFetchError,
  } = useFetchTodos();
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
  const filteredTodos = useFilteredTodos({ todos, filter });
  const { error } = useErrorState();
  const [clearCompletedError, setClearCompletedError] =
    useState<ErrorType | null>(null); // Stan dla clearCompletedError
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { inputRef, triggerFocus } = useInputFocus();

  useEffect(() => {
    if (initialTodos) {
      setTodos(initialTodos);
    }
  }, [initialTodos]);

  const contextValue: TodoContextType = {
    todos,
    setTodos,
    filteredTodos,
    filter,
    error: error || fetchError,
    clearCompletedError,
    setFilter,
    setError: setFetchError,
    setClearCompletedError,
    tempTodo,
    setTempTodo,
    inputRef,
    triggerFocus,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }

  return context;
};
