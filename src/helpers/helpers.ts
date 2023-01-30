import { useMemo } from 'react';
import { Todo, TodoCompleteStatus } from '../types/Todo';

export const filteredTodos = (
  (todoCompleteStatus: TodoCompleteStatus, todos: Todo[]) => {
    switch (todoCompleteStatus) {
      case TodoCompleteStatus.Active:
        return todos.filter(todo => !todo.completed);

      case TodoCompleteStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  });

export const getTodoCompletedId = (todos: Todo[]) => {
  const filteredTodoCompleted = todos.filter(todo => todo.completed);

  return filteredTodoCompleted.map(todo => todo.id);
};
