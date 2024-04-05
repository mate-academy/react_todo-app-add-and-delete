/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { ErrorMessages, Todo } from '../types/Todo';
import * as todoService from '../../src/api/todos';

type ContextType = {
  error: ErrorMessages | null;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  setError: (value: ErrorMessages | null) => void;
  displayError: (message: ErrorMessages) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  activeTodo: Todo | null;
  setActiveTodo: (todo: Todo | null) => void;
  handleDeleteTodo: (todo: Todo) => void;
};

export const TodoContext = React.createContext<ContextType>({
  error: null,
  setError: (_value: ErrorMessages | null) => {},
  displayError: (_message: ErrorMessages) => {},
  tempTodo: null,
  setTempTodo: (_todo: Todo | null) => {},
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
  todos: [],
  setTodos: () => [],
  activeTodo: null,
  setActiveTodo: (_todo: Todo | null) => {},
  handleDeleteTodo: (_todo: Todo) => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const displayError = useCallback(
    (message: ErrorMessages) => {
      setError(message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    },
    [setError],
  );

  const handleDeleteTodo = (todo: Todo) => {
    setIsLoading(true);
    setActiveTodo(todo);
    todoService
      .deleteTodo(todo.id)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(item => item.id !== todo.id),
        ),
      )
      .catch(() => displayError(ErrorMessages.DeleteTodo))
      .finally(() => {
        setActiveTodo(null);
        setIsLoading(false);
      });
  };

  const value = {
    error,
    setError,
    displayError,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    todos,
    setTodos,
    setActiveTodo,
    activeTodo,
    handleDeleteTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
