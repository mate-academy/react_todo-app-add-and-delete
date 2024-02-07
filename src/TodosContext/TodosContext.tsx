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
import { deleteLoadingIds } from '../services/changeLoadingIds';

type Props = {
  children: React.ReactNode;
};

interface Loading {
  loading: number[] | null;
  setLoading: React.Dispatch<React.SetStateAction<number[] | null>>;
}

export const TodosContext = React.createContext<Todos>({
  todos: [],
  setTodos: () => {},
});

export const TodoUpdateContext = React.createContext<Context>({
  addTodo: (_todo: Todo) => {},
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
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [newError, setNewError] = useState<ErrorMessages | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<number[] | null>(null);

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
    api
      .createTodo(todo)
      .then((res) => setNewTodo(res))
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToAddTodo);
        setShowError(() => true);
        setTodos((prev) => prev.filter((t) => t.id !== 0));
      })
      .finally(() => {
        setLoading(deleteLoadingIds(todo.id, loading));
      });
  }

  console.log(todos);

  function removeTodo(todoId: number) {
    api
      .deleteTodo(todoId)
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToDelete);
        setShowError(true);
      })
      .finally(() => setLoading(deleteLoadingIds(todoId, loading)));
  }

  function changeTodo(todoId: number, completed: boolean) {
    api
      .updateTodo(todoId, completed)
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToUpdate);
        setShowError(true);
      }).finally(() => {
        setLoading(deleteLoadingIds(todoId, loading));
      });
  }

  const load = useMemo(() => ({ loading, setLoading }), [loading]);
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
