import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { DefaultValue } from './types/DefaultValue';

export const USER_ID = 11819;

const defaultValue: DefaultValue = {
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  setVisibleTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  inputRef: { current: null },
  error: ErrorMessage.Empty,
  setError: () => {},
  isClearCompleted: false,
  setIsClearCompleted: () => {},
};

export const TodoContext = React.createContext(defaultValue);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(ErrorMessage.Empty);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
        setVisibleTodos(todosFromServer);
      })
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  const value = {
    todos,
    setTodos,
    visibleTodos,
    setVisibleTodos,
    tempTodo,
    setTempTodo,
    inputRef,
    error,
    setError,
    isClearCompleted,
    setIsClearCompleted,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
