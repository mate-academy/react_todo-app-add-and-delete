import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Todo } from '../types/Todo';

const DeletedTodos: number[] = [];
const USER_ID = 11993;

type ContextValue = {
  error: string,
  setError: (error: string) => void,
  todoList: Todo[],
  setTodoList: (todos: Todo[]) => void,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
  USER_ID: number,
  DeletedTodos: number[],
};

export const PageContext = React.createContext<ContextValue>({
  error: '',
  setError: () => {},
  todoList: [],
  setTodoList: () => {},
  isLoading: false,
  setIsLoading: () => {},
  USER_ID,
  DeletedTodos: [],
});

type Props = {
  children: React.ReactNode,
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => debounce(() => setError(''), 3000), [setError, error]);

  const providerValue = {
    error,
    setError,
    todoList,
    setTodoList,
    isLoading,
    setIsLoading,
    USER_ID,
    DeletedTodos,
  };

  return (
    <PageContext.Provider value={providerValue}>
      {children}
    </PageContext.Provider>
  );
};
