import { Todo } from '../types/Todo';

export function filterTodo(todo: Todo, currentStatus: string) {
  switch (currentStatus) {
    case 'Active':
      return !todo.completed;

    case 'Completed':
      return todo.completed;

    default:
      return true;
  }
}
