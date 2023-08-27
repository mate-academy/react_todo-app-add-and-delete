import React, { useMemo, useState } from 'react';
import { ListAction } from '../Enum/ListAction';
import { Todo } from '../types/Todo';
import { TodosContext } from '../types/TodosContext';
import { ErrorMessage } from '../Enum/ErrorMessage';

export const TodoContext = React.createContext<TodosContext>({
  todos: [],
  setTodos: () => {},
  filter: ListAction.ALL,
  setFilter: () => {},
  filterTodos: () => [],
  isToggleAll: false,
  setIsToggleAll: () => {},
  isError: ErrorMessage.NONE,
  setIsError: () => {},
  loading: false,
  setLoading: () => [],
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<ListAction>(ListAction.ALL);
  const [isToggleAll, setIsToggleAll] = useState<boolean>(false);
  const [isError, setIsError] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [loading, setLoading] = useState<boolean>(false);

  const filterTodos = () => {
    switch (filter) {
      case ListAction.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case ListAction.COMPLETED:
        return todos.filter(todo => todo.completed);
      case ListAction.ALL:
      default:
        return todos;
    }
  };

  const initTodos = useMemo(() => ({
    todos,
    setTodos,
    filter,
    setFilter,
    filterTodos,
    isToggleAll,
    setIsToggleAll,
    isError,
    setIsError,
    loading,
    setLoading,
  }), [filter, todos]);

  return (
    <TodoContext.Provider value={initTodos}>
      {children}
    </TodoContext.Provider>
  );
};
