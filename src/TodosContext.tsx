import React, { useMemo, useState } from 'react';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

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
  setToBeCleared: (d: number[]) => void;
}

export const TodosContext = React.createContext<TodosGlobalContext>({
  todos: [],
  setTodos: () => {},
  filteredTodos: [],
  errorMessage: Error.Absent,
  setErrorMessage: () => {},
  filter: Filter.All,
  setFilter: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  toBeCleared: [],
  setToBeCleared: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.Absent);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [toBeCleared, setToBeCleared] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
        default:
          return true;
      }
    });
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
    setToBeCleared,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
