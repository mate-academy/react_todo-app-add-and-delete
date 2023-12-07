import React, { useEffect, useState, useMemo } from 'react';

import { getTodos } from '../api/todos';

import { Error } from '../types/Error';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface TodosContextType {
  USER_ID: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoFilter: Status,
  setTodoFilter: (todoFilter: Status) => void,
  todoError: null | Error,
  setTodoError: (todoError: Error | null) => void,
}

const initialTodosContext: TodosContextType = {
  USER_ID: 12002,
  todos: [],
  setTodos: () => { },
  todoFilter: Status.All,
  setTodoFilter: () => { },
  todoError: null,
  setTodoError: () => { },
};

export const TodosContext = React.createContext<TodosContextType>(
  initialTodosContext,
);

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12002;

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<Status>(Status.All);
  const [todoError, setTodoError] = useState<Error | null>(null);

  useEffect(() => {
    setTodoError(null);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setTodoError(Error.LoadTodosError));
  }, []);

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    todoFilter,
    setTodoFilter,
    todoError,
    setTodoError,
  }), [todos, todoFilter, todoError]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
