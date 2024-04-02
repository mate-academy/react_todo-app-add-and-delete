import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import { getTodos } from '../api/todos';

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [] as Todo[],
  setTodos: () => {},
});

type ErrorContextType = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorContext = React.createContext<ErrorContextType>({
  errorMessage: '',
  setErrorMessage: () => {},
});

type TempTodoContextType = {
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TempTodoContext = React.createContext<TempTodoContextType>({
  tempTodo: null,
  setTempTodo: () => {},
});

type DeletingTodosIdsContextType = {
  deletingTodosIds: number[];
  setDeletingTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const DeletingTodosIdsContext =
  React.createContext<DeletingTodosIdsContextType>({
    deletingTodosIds: [],
    setDeletingTodosIds: () => {},
  });

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
    }),
    [todos, setTodos],
  );

  const errorValue = useMemo(
    () => ({
      errorMessage,
      setErrorMessage,
    }),
    [errorMessage, setErrorMessage],
  );

  const tempTodoValue = useMemo(
    () => ({
      tempTodo,
      setTempTodo,
    }),
    [tempTodo, setTempTodo],
  );

  const deletingTodosIdsValue = useMemo(
    () => ({
      deletingTodosIds,
      setDeletingTodosIds,
    }),
    [deletingTodosIds, setDeletingTodosIds],
  );

  return (
    <TodosContext.Provider value={value}>
      <ErrorContext.Provider value={errorValue}>
        <TempTodoContext.Provider value={tempTodoValue}>
          <DeletingTodosIdsContext.Provider value={deletingTodosIdsValue}>
            {children}
          </DeletingTodosIdsContext.Provider>
        </TempTodoContext.Provider>
      </ErrorContext.Provider>
    </TodosContext.Provider>
  );
};
