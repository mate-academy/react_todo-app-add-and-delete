/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TodoType } from './types/TodoType';
import { Filter } from './types/Filter';
import { ErrorsType } from './types/ErrorsType';
import { getTodos } from './api/todos';

const USER_ID = 10236;

type TodoContextType = {
  USER_ID: number;
  todos: TodoType[];
  filterTodo: Filter;
  errorMessage: string;
  tempTodo: TodoType | null;
  selectedTodos: TodoType[],
  setTempTodo: (tempTodo: TodoType | null) => void;
  getFilteredTodo: (filter: Filter) => void;
  setErrorMessage: (error: string) => void;
  addTodo: (newTodo: TodoType) => void;
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  setHasDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
};

export const TodoContext = React.createContext<TodoContextType>({
  USER_ID,
  todos: [],
  filterTodo: Filter.All,
  errorMessage: '',
  tempTodo: null,
  selectedTodos: [],
  setTempTodo: () => {},
  getFilteredTodo: () => {},
  setErrorMessage: () => {},
  setTodos: () => {},
  addTodo: () => {},
  setHasDelete: () => {},
  setSelectedTodos: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filterTodo, setFilterTodo] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [hasDelete, setHasDelete] = useState<boolean>(false);
  const [selectedTodos, setSelectedTodos] = useState<TodoType[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorsType.Load);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [hasDelete]);

  function addTodo(newTodo: TodoType) {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  }

  const value = {
    USER_ID,
    todos,
    filterTodo,
    errorMessage,
    tempTodo,
    setTempTodo,
    setErrorMessage,
    getFilteredTodo: (filter: Filter) => {
      setFilterTodo(filter);
    },
    setTodos,
    addTodo,
    setHasDelete,
    selectedTodos,
    setSelectedTodos,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
