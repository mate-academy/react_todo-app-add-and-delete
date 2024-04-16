/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { deleteTodo } from '../api/todos';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

type TodosContextType = {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  handleDeleteTodo: (pressedId: number) => void;
  allId: number[];
  setAllId: (allId: number[]) => void;
  errorMessage: string;
  setErrorMessage(errorMessage: string): void;
  isSubmiting: boolean;
  setIsSubmiting(isSubmiting: boolean): void;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  handleDeleteTodo: (_pressedId: number) => {},
  allId: [],
  setAllId: (_allId: number[]) => {},
  errorMessage: '',
  setErrorMessage: (_errorMessage: string) => {},
  isSubmiting: false,
  setIsSubmiting: (_isSubmiting: boolean) => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allId, setAllId] = useState<number[]>([]);

  const handleDeleteTodo = (pressedId: number) => {
    setAllId(prevAllId => [...prevAllId, pressedId]);

    setIsSubmiting(true);

    deleteTodo(pressedId)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== pressedId)),
      )
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsSubmiting(false);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      handleDeleteTodo,
      allId,
      setAllId,
      errorMessage,
      setErrorMessage,
      isSubmiting,
      setIsSubmiting,
    }),
    [todos, setTodos, allId, errorMessage, isSubmiting],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
