import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilteredList = (
  currentFilter: Filter,
  todosList: Todo[],
): Todo[] => {
  if (currentFilter === Filter.all) {
    return todosList;
  }

  return todosList?.filter(({ completed }) => {
    if (currentFilter === Filter.active) {
      return !completed;
    }

    return completed;
  });
};
