import React, { useState, useMemo, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { FilterOption } from '../types/FilterOption';
import { getTodos } from '../api/todos';

const initiatTodos: Todo[] = [];

interface TodosContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterOption: FilterOption,
  setFilterOption: (filterOption: FilterOption) => void,
  USER_ID: number,
  errorMessage: string,
  setErrorMessage: (errorMessage: string) => void,
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: initiatTodos,
  setTodos: () => { },
  filterOption: FilterOption.Active,
  setFilterOption: () => { },
  USER_ID: 11930,
  errorMessage: '',
  setErrorMessage: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState(initiatTodos);
  const [filterOption, setFilterOption]
    = useState<FilterOption>(FilterOption.All);
  const USER_ID = 11930;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filterOption,
    setFilterOption,
    USER_ID,
    errorMessage,
    setErrorMessage,
  }), [todos, filterOption, errorMessage]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
