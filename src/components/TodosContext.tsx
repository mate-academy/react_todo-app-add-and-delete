import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';

type PropsContext = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  incompleteCount: number;
  messageError: string;
  setMessageError: (message: Errors) => void;
  loading: boolean;
  setLoading: (status: boolean) => void;
  loadingTodo: number | null;
  setLoadingTodo: (id: number | null) => void;
};

export const TodosContext = React.createContext<PropsContext>({
  todos: [],
  setTodos: () => {},
  filter: FilterStatus.All,
  setFilter: () => {},
  incompleteCount: 0,
  messageError: '',
  setMessageError: () => {},
  loading: false,
  setLoading: () => {},
  loadingTodo: null,
  setLoadingTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterStatus.All);
  const [messageError, setMessageError] = useState(Errors.NoError);
  const [loading, setLoading] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);

  // let incompleteCount = todos.filter(todo => !todo.completed).length;
  const incompleteCount = todos.filter(
    todo => !todo.completed && todo.id !== 123456789,
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

  // useEffect(() => {
  //   // eslint-disable-next-line
  //     incompleteCount = todos.filter(todo => !todo.completed).length;
  // }, [todos]);

  const valueTodos = useMemo(
    () => ({
      todos,
      setTodos,
      incompleteCount,
      filter,
      setFilter,
      messageError,
      setMessageError,
      loading,
      setLoading,
      loadingTodo,
      setLoadingTodo,
    }),
    // eslint-disable-next-line
    [todos, incompleteCount, filter, messageError],
  );

  return (
    <TodosContext.Provider value={valueTodos}>{children}</TodosContext.Provider>
  );
};
