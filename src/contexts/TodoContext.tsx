import React, { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { Filtering } from '../types/Filtering';
import { TempTodo } from '../types/TempTodo';

export interface TodoContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filtering: Filtering;
  setFiltering: React.Dispatch<React.SetStateAction<Filtering>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  tempTodo: TempTodo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<TempTodo | null>>
}

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  filtering: Filtering.ALL,
  setFiltering: () => {},
  loading: false,
  setLoading: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

interface Props {
  children: React.ReactNode
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtering, setFiltering] = useState(Filtering.ALL);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);

  const value: TodoContextType = useMemo(() => (
    {
      todos,
      setTodos,
      filtering,
      setFiltering,
      loading,
      setLoading,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
    }
  ), [todos, filtering, loading, errorMessage, tempTodo]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
