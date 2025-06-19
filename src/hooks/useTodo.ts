import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { FilterStatusType } from '../types/FilterStatusType';
import { getTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorStatusType';
import { getVisibleTodos } from '../utils/getVisibleTodos';

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatusType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsToDelete, setTodoIdsToDelete] = useState<number[]>([]);

  const completedTodoExists = todos.some(todo => todo.completed);
  const visibleTodos = getVisibleTodos(todos, filterStatus);
  const numberOfNotCompletedTodos = todos.filter(
    todo => !todo.completed,
  ).length;

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setErrorMessage(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  return {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    visibleTodos,
    todoIdsToDelete,
    setFilterStatus,
    filterStatus,
    completedTodoExists,
    numberOfNotCompletedTodos,
    setTodoIdsToDelete,
  };
}
