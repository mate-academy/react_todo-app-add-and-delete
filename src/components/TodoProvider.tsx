import React, { createContext, useEffect, useState } from 'react';

import { Todo } from '../types/Todo';
import { addTodo, deleteTodo, getTodos } from '../api/todos';
import { USER_ID } from '../utils/constants';

interface TodoContextProps {
  todos: Todo[];
  addTodoHandler: (todo: Omit<Todo, 'id'>, onSuccess: () => void) => void;
  deleteTodoHandler: (todoId: number) => void;
  errorMessage: string;
  setErrorMessage: (str: string) => void;
  isLoadingMap: {};
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  addTodoHandler: () => { },
  deleteTodoHandler: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  isLoadingMap: {},
});

type TodoProviderProps = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingMap, setIsLoadingMap]
    = useState<{ [key: number]: boolean } | {}>({});

  const addTodoHandler = async (
    newTodo: Omit<Todo, 'id'>, onSuccess: () => void,
  ) => {
    try {
      const createdTodo = await addTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
      onSuccess();
    } catch (error) {
      setErrorMessage('Unable to add todo');
    }
  };

  const deleteTodoHandler = async (todoId: number) => {
    setIsLoadingMap(prevLoadingMap => ({
      ...prevLoadingMap,
      [todoId]: true,
    }));

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(({ id }) => id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setIsLoadingMap(prevLoadingMap => ({
      ...prevLoadingMap,
      [todoId]: false,
    }));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodoHandler,
        deleteTodoHandler,
        setErrorMessage,
        errorMessage,
        isLoadingMap,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
