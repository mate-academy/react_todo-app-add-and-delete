/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as api from '../api/todos';
import { USER_ID } from '../utils/constants';

import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { Error } from '../types/Error';

type Props = {
  children: ReactNode;
};

export const TodoContext = React.createContext({
  todos: [] as Todo[],
  setTodos: (_todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => { },
  status: Status.All,
  setStatus: (_status: Status) => { },
  errorMessage: null as string | null,
  setErrorMessage: (_message: Error | null) => { },
  deletedTodos: [] as Todo[] | null,
  setDeletedTodos: (_value: Todo[]) => { },
  tempTodo: null as Todo | null,
  setTempTodo: (_todo: Todo | null) => { },
  deleteTodo: (_todoId: number) => { },
  deleteTodos: (_todos: Todo[]) => { },
  addTodo: (_todo: Todo) => { },
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [deletedTodos, setDeletedTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    api.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.GET));
  }, []);

  const addTodo = async (todo: Todo) => {
    try {
      const newTodo = await api.createTodo(todo);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await api.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    }
  };

  const deleteTodos = async (allTodos: Todo[]) => {
    try {
      const updadetTodos = allTodos.filter(todo => todo.completed);

      setDeletedTodos(updadetTodos);

      await Promise.all(updadetTodos.map(todo => api.deleteTodo(todo.id)));

      setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    } finally {
      setDeletedTodos(null);
    }
  };

  const value = useMemo(() => {
    return {
      todos,
      setTodos,
      status,
      setStatus,
      errorMessage,
      setErrorMessage,
      deletedTodos,
      setDeletedTodos,
      deleteTodo,
      deleteTodos,
      addTodo,
      tempTodo,
      setTempTodo,
    };
  }, [
    todos,
    status,
    errorMessage,
    deletedTodos,
    tempTodo,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
