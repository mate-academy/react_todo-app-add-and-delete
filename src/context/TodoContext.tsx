/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createTodo, deleteTodo, getTodos } from '../api/todos';
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
  deleteTodos: (_todoId: number[]) => { },
  deleteCompletedTodos: (_todos: Todo[]) => { },
  addTodo: (_todo: Todo) => { },
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [deletedTodos, setDeletedTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.GET));
  }, []);

  const addTodo = async (todo: Todo) => {
    const newTodo = await createTodo(todo);

    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const deleteTodos = async (todoIds: number[]) => {
    try {
      await Promise.all(todoIds.map(todoId => deleteTodo(todoId)));

      setTodos(currentTodos => currentTodos
        .filter(todo => !todoIds.includes(todo.id)));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    }
  };

  const deleteCompletedTodos = async (allTodos: Todo[]) => {
    const updadetTodos = allTodos.filter(todo => todo.completed);

    setDeletedTodos(updadetTodos);

    try {
      await Promise.all(updadetTodos.map(todo => deleteTodo(todo.id)));

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
      deleteTodos,
      deleteCompletedTodos,
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
