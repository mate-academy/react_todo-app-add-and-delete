import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  selectedFilter: string,
) => {
  let todosCopy = [...todos];

  if (selectedFilter) {
    todosCopy = todosCopy.filter(({ completed }) => {
      switch (selectedFilter) {
        case FilterStatus.Active:
          return !completed;
        case FilterStatus.Completed:
          return completed;
        default:
          return todosCopy;
      }
    });
  }

  return todosCopy;
};
