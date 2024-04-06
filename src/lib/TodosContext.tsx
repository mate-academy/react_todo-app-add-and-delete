import React, { useContext, useEffect, useMemo, useState } from 'react';
import * as todosService from '../api/todos';
import { ErrorText } from '../types/ErrorText';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import type { ITodosStateContext } from '../types/TodosStateContext';

export const StateContext = React.createContext<ITodosStateContext>({
  todos: [],
  setTodos: () => {},
  query: Status.All,
  setQuery: () => {},
  errorMessage: ErrorText.NoErr,
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isLoading: false,
  setIsLoading: () => {},
  processTodoIds: [],
  setProcessTodoIds: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(ErrorText.NoErr);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processTodoIds, setProcessTodoIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todosService.getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage(ErrorText.LoadErr);
        setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
      }
    };

    fetchTodos();
  }, []);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      query,
      setQuery,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      isLoading,
      setIsLoading,
      processTodoIds,
      setProcessTodoIds,
    }),
    [todos, query, errorMessage, tempTodo, isLoading, processTodoIds],
  );

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useTodos = () => useContext(StateContext);
