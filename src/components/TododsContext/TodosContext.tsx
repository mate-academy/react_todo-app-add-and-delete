import React, { useEffect, useMemo, useState } from 'react';
import { FilterOption } from '../../types/FilterOption';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';

const initialTodos: Todo[] = [];

interface TodosContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filterOption: FilterOption,
  setFilterOption: (filterOption: FilterOption) => void,
  USER_ID: number,
  errorMessage: string,
  setErrorMessage: (errorMessages: string) => void,
  loading: boolean,
  setLoading: (arg: boolean) => void,
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: initialTodos,
  setTodos: () => {},
  filterOption: FilterOption.Active,
  setFilterOption: () => {},
  USER_ID: 12068,
  errorMessage: '',
  setErrorMessage: () => {},
  loading: false,
  setLoading: () => {},
});

type Props = {
  children: React.ReactNode
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [filterOption, setFilterOption]
  = useState<FilterOption>(FilterOption.All);
  const [errorMessage, setErrorMessage] = useState('');
  const USER_ID = 12068;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filterOption,
    setFilterOption,
    USER_ID,
    errorMessage,
    setErrorMessage,
    loading,
    setLoading,
  }), [todos, errorMessage, filterOption, loading]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
