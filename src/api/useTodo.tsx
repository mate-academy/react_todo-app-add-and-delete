import React, { useMemo, useState } from 'react';
import { Error } from '../types/Error';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodosGlobalContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredTodos: Todo[];
  errorMessage: Error;
  setErrorMessage: (e: Error) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  tempTodo: Todo | null;
  setTempTodo: (t: Todo | null) => void;
  toBeCleared: number[];
  setCleared: (d: number[]) => void;
}

export const TodosContext = React.createContext<TodosGlobalContext>({
  todos: [],
  setTodos: () => {},
  filteredTodos: [],
  errorMessage: Error.Absent,
  setErrorMessage: () => {},
  filter: Filter.all,
  setFilter: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  toBeCleared: [],
  setCleared: () => {},
});

export const useTodo = (): TodosGlobalContext => React.useContext(TodosContext);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.Absent);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [toBeCleared, setCleared] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);

      case Filter.completed:
        return todos.filter(todo => todo.completed);

      case Filter.all:
      default:
        return todos;
    }
  }, [todos, filter]);

  const value = {
    todos,
    setTodos,
    filteredTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    tempTodo,
    setTempTodo,
    toBeCleared,
    setCleared,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
