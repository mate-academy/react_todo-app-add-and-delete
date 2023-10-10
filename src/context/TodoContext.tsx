import React, {
  Dispatch,
  ReactNode, SetStateAction, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';
import { ErrorEnum } from '../types/Error';

export const USER_ID = 11552;

export enum FilterOption {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

type Props = {
  children: ReactNode;
};

interface ContextValues {
  todos: Todo[],
  visibleTodos: Todo[],
  activeTodosAmount: number,
  error: string | null,
  filter: string,
  setError: (val: string | null) => void,
  setFilter: (filter: FilterOption) => void,
  deleteTodoAction: (id: number) => void,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  tempTodo: Todo | null,
  loadingItems: number[],
  clearCompleted: () => void,
  setTodos: Dispatch<SetStateAction<Todo[]>>
}

export const TodoContext = React.createContext({} as ContextValues);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterOption>(FilterOption.all);
  const [error, setError] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);

  useEffect(() => {
    setError(null);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorEnum.loadError));
  }, []);
  const filterTodos = (
    array: Todo[], selectedFilterOption: FilterOption,
  ) => {
    return array.filter(todo => {
      switch (selectedFilterOption) {
        case FilterOption.active:
          return !todo.completed;
        case FilterOption.completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  };

  const deleteTodoAction = (id: number) => {
    setLoadingItems((prev) => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => setError(ErrorEnum.deleteError))
      .finally(() => {
        setLoadingItems((prev) => prev.filter((itemId) => itemId !== id));
      });
  };

  const clearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodoAction(todo.id);
      }
    });
  };

  const visibleTodos: Todo[] = useMemo(() => filterTodos(todos, filter),
    [todos, filter]);

  const activeTodosAmount = todos.filter((todo) => !todo.completed).length;

  const contextValues: ContextValues = useMemo(() => ({
    todos,
    visibleTodos,
    activeTodosAmount,
    error,
    setError,
    filter,
    setFilter,
    deleteTodoAction,
    setTempTodo,
    tempTodo,
    setTodos,
    loadingItems,
    clearCompleted,
  }), [
    visibleTodos,
    activeTodosAmount,
    error,
    filter,
    tempTodo,
    loadingItems,
  ]);

  return (
    <TodoContext.Provider value={contextValues}>
      {children}
    </TodoContext.Provider>
  );
};
