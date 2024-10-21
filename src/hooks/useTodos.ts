import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import { Todo, FilterType, ErrorType } from '../types';
import * as todosService from '../api/todos';
import { getCompletedTodos, filterTodos } from '../utils';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);

  const setErrorDebounced = useMemo(
    () => debounce(error => setErrorMessage(error), 3000),
    [],
  );

  const handleAddError = (error: ErrorType) => {
    setErrorMessage(error);
    setErrorDebounced(ErrorType.None);
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const newTempTodo = { ...newTodo, id: 0 };

    setTempTodo(newTempTodo);
    setLoadingTodoIds(current => [...current, newTempTodo.id]);

    return todosService
      .createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch((error: Error) => {
        handleAddError(ErrorType.Adding);

        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(current =>
          current.filter(loadingTodoId => loadingTodoId !== newTempTodo.id),
        );
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    return todosService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(current => current.filter(todo => todo.id !== todoId)),
      )
      .catch((error: Error) => {
        handleAddError(ErrorType.Deleting);

        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(current =>
          current.filter(loadingTodoId => loadingTodoId !== todoId),
        ),
      );
  };

  const deleteCompletedTodo = () => {
    const completedTodoIds = getCompletedTodos(todos).map(todo => todo.id);

    Promise.allSettled(completedTodoIds.map(todoId => deleteTodo(todoId)));
  };

  const filteredTodos = useMemo(
    () => filterTodos(todos, { filter }),
    [todos, filter],
  );

  const loadTodos = () => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => handleAddError(ErrorType.Loading));
  };

  useEffect(loadTodos, []);

  return {
    todos,
    tempTodo,
    loadingTodoIds,
    errorMessage,
    setErrorMessage,
    handleAddError,
    addTodo,
    deleteTodo,
    deleteCompletedTodo,
    filteredTodos,
    filter,
    setFilter,
  };
};
