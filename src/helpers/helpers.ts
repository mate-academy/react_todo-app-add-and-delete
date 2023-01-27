import { Todo, TodoCompleteStatus } from '../types/Todo';

export const todoFilteredCompleted = (
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
  const filteredTodos = todos.filter(todo => todo.completed);

  return filteredTodos.map(todo => todo.id);
};
