import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import * as api from '../api/todos';
import { Context, ContextUpdate } from '../types/Context';
import { Status } from '../types/Status';

export const TodosContext = React.createContext<Context>({
  todos: [],
  setTodos: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  filterTodos: Status.all,
  setFilterTodos: () => { },
});

export const TodoUpdateContext = React.createContext<ContextUpdate>({
  addTodo: () => {},
  deleteTodo: () => {},
  // updateTodo: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterTodos, setFilterTodos] = useState<Status>(Status.all);

  const USER_ID = 91;

  function loadTodos() {
    api.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  function loadError() {
    const errorDelay = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(errorDelay);
  }

  useEffect(() => {
    loadTodos();
    const cleanup = loadError();

    return cleanup;
  }, [errorMessage]);

  function addTodo(todo: Todo) {
    return api.createTodo(todo)
      .then(loadTodos);
  }

  function deleteTodo(todoId: number) {
    return api.deleteTodo(todoId)
      .then(loadTodos);
  }

  // function updateTodo(todoToUpdate: Todo) {
  //   return api.updateTodo(todoToUpdate)
  //     .then(loadTodos);
  // }

  const methods = useMemo(() => ({
    addTodo,
    deleteTodo,
    // updateTodo,
  }), []);

  const values = useMemo(() => ({
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filterTodos,
    setFilterTodos,
  }), [todos, errorMessage, filterTodos]);

  return (
    <TodoUpdateContext.Provider value={methods}>
      <TodosContext.Provider value={values}>
        {children}
      </TodosContext.Provider>
    </TodoUpdateContext.Provider>
  );
};
