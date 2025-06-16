import { FilterType } from '../types/FilterType';

export function getPreparedTodos<T extends { completed: boolean }>(
  todos: T[],
  filter: FilterType,
): T[] {
  return todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });
}
