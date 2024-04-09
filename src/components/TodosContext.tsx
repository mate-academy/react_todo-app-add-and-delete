import React, { useEffect, useMemo, useState } from 'react';
import { TEMPORARY_TODO_ID, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';

type PropsContext = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  activeCount: number;
  messageError: string;
  setMessageError: (message: Errors) => void;
  loadingTodo: number[];
  setLoadingTodo: (ids: number[]) => void;
};

export const TodosContext = React.createContext<PropsContext>({
  todos: [],
  setTodos: () => {},
  filter: FilterStatus.All,
  setFilter: () => {},
  activeCount: 0,
  messageError: '',
  setMessageError: () => {},
  loadingTodo: [],
  setLoadingTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterStatus.All);
  const [messageError, setMessageError] = useState(Errors.NoError);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const activeCount = todos.filter(
    todo => !todo.completed && todo.id !== TEMPORARY_TODO_ID,
  ).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        setMessageError(Errors.CantLoad);
        hideError(setMessageError);
        throw error;
      });
  }, []);

  const valueTodos = useMemo(
    () => ({
      todos,
      setTodos,
      activeCount,
      filter,
      setFilter,
      messageError,
      setMessageError,
      loadingTodo,
      setLoadingTodo,
    }),
    [todos, activeCount, filter, messageError, loadingTodo],
  );

  return (
    <TodosContext.Provider value={valueTodos}>{children}</TodosContext.Provider>
  );
};
