/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import * as api from '../api/todos';
import { USER_ID } from '../App';
import { Context } from '../types/Context';
import { Todos } from '../types/Todos';
import { ErrorMessages, Errors } from '../types/Error';

type Props = {
  children: React.ReactNode;
};

interface Loading {
  loading: number[] | null;
  setLoading: React.Dispatch<React.SetStateAction<number[]>>;
  startLoading: (id: number) => void;
  finishLoading: (id: number) => void;
}

export const TodosContext = React.createContext<Todos>({
  todos: [],
  setTodos: () => {},
});

export const TodoUpdateContext = React.createContext<Context>({
  addTodo: async (_todo: Todo) => {},
  removeTodo: (_id: number) => {},
  changeTodo: (_todoId: number, _todo: boolean) => {},
});

export const ErrorsContext = React.createContext<Errors>({
  newError: null,
  setNewError: () => {},
  showError: false,
  setShowError: () => {},
});

export const LoadingContext = React.createContext<Loading>({
  loading: null,
  setLoading: () => {},
  startLoading: (_id: number) => {},
  finishLoading: (_id: number) => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [newError, setNewError] = useState<ErrorMessages | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<number[]>([]);

  function startLoading(id: number) {
    setLoading((prev) => [...prev, id]);
  }

  function finishLoading(idToFinish: number) {
    setLoading((prev) => prev.filter(id => id !== idToFinish));
  }

  function loadTodos() {
    api
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToloadTodos);
        setShowError(true);
      });
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    setTodos(todos.filter(todo => todo.id !== 0));
    if (newTodo !== null) {
      setTodos((prev) => [...prev, newTodo]);
    }
  }, [newTodo]);

  function addTodo(todo: Todo) {
    return api.createTodo(todo)
      .then((res) => setNewTodo(res))
      .then(loadTodos)
      .catch((error) => {
        setNewError(ErrorMessages.unableToAddTodo);
        setShowError(true);
        setTodos((prev) => prev.filter((t) => t.id !== 0));
        throw error;
      })
      .finally(() => {
        finishLoading(todo.id);
      });
  }

  console.log(todos);

  function removeTodo(todoId: number) {
    return api.deleteTodo(todoId)
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToDelete);
        setShowError(true);
      })
      .finally(() => finishLoading(todoId));
  }

  function changeTodo(todoId: number, completed: boolean) {
    return api.updateTodo(todoId, completed)
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToUpdate);
        setShowError(true);
      }).finally(() => {
        finishLoading(todoId);
      });
  }

  const load = useMemo(() => ({
    loading, setLoading, startLoading, finishLoading,
  }), [loading]);
  const methods = useMemo(() => ({ addTodo, removeTodo, changeTodo }), []);
  const value = useMemo(() => ({ todos, setTodos }), [todos]);
  const errors = useMemo(() => (
    {
      newError, setNewError, showError, setShowError,
    }), [Error, showError]);

  return (
    <LoadingContext.Provider value={load}>
      <ErrorsContext.Provider value={errors}>
        <TodoUpdateContext.Provider value={methods}>
          <TodosContext.Provider value={value}>
            {children}
          </TodosContext.Provider>
        </TodoUpdateContext.Provider>
      </ErrorsContext.Provider>
    </LoadingContext.Provider>
  );
};
