import { Todo, StatusFilter } from '../types';

export function filterTodos(todos: Todo[], filterBy: StatusFilter) {
  return todos.filter(({ completed }) => {
    switch (filterBy) {
      case StatusFilter.Active:
        return !completed;
      case StatusFilter.Completed:
        return completed;
      default:
        return true;
    }
  });
}
