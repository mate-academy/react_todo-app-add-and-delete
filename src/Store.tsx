import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoWithLoader } from './types/TodoWithLoader';
type InitialCotext = {
  todos: TodoWithLoader[];
  setTodos: React.Dispatch<React.SetStateAction<TodoWithLoader[]>>;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  tempTodo: null | Todo;
  setTempTodo: (tempTodo: null | Todo) => void;
  updatedAt: Date;
  setUpdatedAt: (date: Date) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const initialCotext = {
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  filter: Filter.all,
  setFilter: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  updatedAt: new Date(),
  setUpdatedAt: () => {},
  loading: false,
  setLoading: () => {},
};

export const todosContext = React.createContext<InitialCotext>(initialCotext);

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<TodoWithLoader[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const value: InitialCotext = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    tempTodo,
    setTempTodo,
    updatedAt,
    setUpdatedAt,
    loading,
    setLoading,
  };

  return (
    <todosContext.Provider value={value}>{children}</todosContext.Provider>
  );
};
