import { StatusFilter } from '../types/StatusFilter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  statusFilter: StatusFilter,
): Todo[] => {
  switch (statusFilter) {
    case StatusFilter.All:
      return todos;
    case StatusFilter.Active:
      return todos.filter(todo => !todo.completed);
    case StatusFilter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
