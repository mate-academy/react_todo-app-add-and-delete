import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

interface StartValue {
  filter: Status;
  setFilter: (s: Status) => void;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: string;
  setErrorMessage: (s: string) => void;
  todoTitleHeader: string;
  setTodoTitleHeader: (s: string) => void;
  tempTodo: null | Todo;
  setTempTodo: (t: Todo | null) => void;
  notifyError: (s: string) => void;
  activeTodos: Todo[];
  forRemove: number[];
  setForRemove: React.Dispatch<React.SetStateAction<number[]>>;
}

const startValue: StartValue = {
  filter: Status.ALL,
  setFilter: () => {},
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  todoTitleHeader: '',
  setTodoTitleHeader: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  notifyError: () => {},
  activeTodos: [],
  forRemove: [],
  setForRemove: () => {},
};

export const Context = React.createContext(startValue);

type Props = {
  children: React.ReactNode;
};

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = useState(Status.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitleHeader, setTodoTitleHeader] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [forRemove, setForRemove] = useState<number[]>([]);

  const activeTodos = todos?.filter(todo => !todo.completed);

  const notifyError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const value: StartValue = {
    filter,
    setFilter,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    todoTitleHeader,
    setTodoTitleHeader,
    tempTodo,
    setTempTodo,
    notifyError,
    activeTodos,
    forRemove,
    setForRemove,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
