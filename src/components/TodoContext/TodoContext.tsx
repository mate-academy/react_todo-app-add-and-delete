import {
  PropsWithChildren, createContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';

enum Status{
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

const prepareTodos = (currentFilter: Status, allTodos: Todo[]) => {
  switch (currentFilter) {
    case Status.all:
    default:
      return [...allTodos];
    case Status.active:
      return [...allTodos].filter((todo) => !todo.completed);
    case Status.completed:
      return [...allTodos].filter((todo) => todo.completed);
  }
};

export const TodoContext = createContext({
  todos: [] as Todo[],
  setTodos: (() => {}) as React.Dispatch<React.SetStateAction<Todo[] | []>>,
  allTodos: [] as Todo[],
  setFilter: (() => {}) as React.Dispatch<React.SetStateAction<Status>>,
  filter: Status.all,
  error: '',
  setError: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
  loading: [] as number[],
  setLoading: (() => {}) as React.Dispatch<React.SetStateAction<number[] | []>>,
});

export const Context: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState<Status>(Status.all);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<number[] | []>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to download todos'));
  }, []);

  const preparedTodos = useMemo(() => {
    return prepareTodos(filter, todos);
  }, [filter, todos]);

  const value = {
    todos: preparedTodos,
    setTodos,
    allTodos: todos,
    setFilter,
    filter,
    error,
    setError,
    loading,
    setLoading,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
