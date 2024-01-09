import { Filters, Todo } from '../types';

export const getFilteredItems = (
  todos: Todo[],
  filter: Filters,
): Todo[] => {
  switch (filter) {
    case Filters.All:
      return todos;

    case Filters.Active:
      return todos.filter((todo) => todo.completed === false);

    case Filters.Completed:
      return todos.filter((todo) => todo.completed === true);

    default:
      return todos;
  }
};
