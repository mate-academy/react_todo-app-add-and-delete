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

export const TodosContext = React.createContext<Todos>({ todos: [] });

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

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [newError, setNewError] = useState<ErrorMessages | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

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
    if (newTodo !== null) {
      const copy = [...todos, newTodo];

      setTodos(copy);
    }
  }, [newTodo]);

  function addTodo(todo: Todo) {
    api
      .createTodo(todo)
      .then(setNewTodo)
      .catch(() => {
        setNewError(ErrorMessages.unableToAddTodo);
        setShowError(true);
      });
  }

  function removeTodo(todoId: number) {
    api
      .deleteTodo(todoId)
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToDelete);
        setShowError(true);
      });
  }

  function changeTodo(todoId: number, completed: boolean) {
    api
      .updateTodo(todoId, completed)
      .then(loadTodos)
      .catch(() => {
        setNewError(ErrorMessages.unableToUpdate);
        setShowError(true);
      });
  }

  const methods = useMemo(() => ({ addTodo, removeTodo, changeTodo }), []);
  const value = useMemo(() => ({ todos }), [todos]);
  const errors = useMemo(() => (
    {
      newError, setNewError, showError, setShowError,
    }), [newError, showError]);

  return (
    <ErrorsContext.Provider value={errors}>
      <TodoUpdateContext.Provider value={methods}>
        <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
      </TodoUpdateContext.Provider>
    </ErrorsContext.Provider>
  );
};
