/* eslint-disable react-hooks/exhaustive-deps */
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
  tempTodo: null,
  setTempTodo: () => { },
  isLoading: false,
  setIsLoading: () => { },
  deleteIds: [],
  setDeleteIds: () => { },
});

export const TodoUpdateContext = React.createContext<ContextUpdate>({
  addTodo: () => { },
  deleteTodo: () => { },
  // updateTodo: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterTodos, setFilterTodos] = useState<Status>(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  const USER_ID = 91;

  function loadTodos() {
    api.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(loadTodos, []);

  function addTodo(todo: Omit<Todo, 'id'>) {
    return api.createTodo(todo)
      .then(loadTodos);
  }

  function deleteTodo(todoId: number) {
    setDeleteIds(prev => [...prev, todoId]);

    return api.deleteTodo(todoId)
      .then(() => loadTodos())
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  }

  // function updateTodo(todoToUpdate: Todo) {
  //   return api.updateTodo(todoToUpdate)
  //     .then(loadTodos)
  //     .catch(() => {
  //       setErrorMessage('Unable to update a todo');
  //     });
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
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    deleteIds,
    setDeleteIds,
  }), [todos, errorMessage, filterTodos, tempTodo, isLoading, deleteIds]);

  return (
    <TodoUpdateContext.Provider value={methods}>
      <TodosContext.Provider value={values}>
        {children}
      </TodosContext.Provider>
    </TodoUpdateContext.Provider>
  );
};
