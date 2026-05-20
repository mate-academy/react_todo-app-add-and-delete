import { FilterStatus } from '../types/filterStatus';
import { TodoViewModel } from '../types/Todo';

export function filterTodos(
  todos: TodoViewModel[],
  status: FilterStatus,
): TodoViewModel[] {
  if (!todos) {
    return [];
  }

  switch (status) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);

    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);

    case FilterStatus.All:
    default:
      return todos;
  }
}
