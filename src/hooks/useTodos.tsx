import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { StatusFilterOptions } from '../types/StatusFilterOptions';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(StatusFilterOptions.all);
  const [todoInOperation, setTodoInOperation] = useState<number[]>([]);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const inputFocus = useRef<HTMLInputElement>(null);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const visibleFooter = useMemo(() => todos.length > 0, [todos]);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, { status: statusFilter }),
    [todos, statusFilter],
  );

  const activeTodos = useMemo(
    () => todos.length - completedTodos.length,
    [todos, completedTodos],
  );

  const allTodosCompleted = useMemo(
    () => todos.length > 0 && completedTodos.length === todos.length,
    [todos, completedTodos],
  );

  const isCompletedTodos = useMemo(
    () => completedTodos.length > 0,
    [completedTodos],
  );

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(todosService.TodosError.unableToLoad);
      });
  }, []);

  const handleTodoDelete = (todoId: number) => {
    setTodoInOperation(current => [...current, todoId]);

    if (inputFocus.current) {
      inputFocus.current.disabled = true;
    }

    todosService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage(todosService.TodosError.unableToDelete))
      .finally(() => {
        setTodoInOperation(current => current.filter(id => id !== todoId));

        if (inputFocus.current) {
          inputFocus.current.disabled = false;
          inputFocus.current.focus();
        }
      });
  };

  const handleDeleteAllCompletedTodos = () => {
    if (inputFocus.current) {
      inputFocus.current.disabled = true;
    }

    Promise.allSettled(completedTodos.map(todo => handleTodoDelete(todo.id)));
  };

  // const handleDeleteAllCompletedTodos = () => {
  // if (inputFocus.current) {
  //   inputFocus.current.disabled = true;
  // }

  //   Promise.all(completedTodos.map(todo => todosService.deleteTodos(todo.id)))
  //     .then(() =>
  //       setTodos(currentTodos => currentTodos.filter(todo => !todo.completed)),
  //     )
  //     .catch(() => setErrorMessage(todosService.TodosError.unableToDelete))
  //     .finally(() => {
  //       if (inputFocus.current) {
  //         inputFocus.current.disabled = false;
  //         inputFocus.current.focus();
  //       }
  //     });
  // };

  const handleTodoAdd = (title: string) => {
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todosService.USER_ID,
    });

    return todosService
      .addTodos({ userId: todosService.USER_ID, title, completed: false })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
        setTempTodo(null);
      });
  };

  return {
    errorMessage,
    setErrorMessage,
    statusFilter,
    setStatusFilter,
    handleHideError,
    visibleFooter,
    filteredTodos,
    activeTodos,
    allTodosCompleted,
    isCompletedTodos,
    handleTodoDelete,
    handleDeleteAllCompletedTodos,
    handleTodoAdd,
    tempTodo,
    setTempTodo,
    inputFocus,
    todoInOperation,
  };
};
