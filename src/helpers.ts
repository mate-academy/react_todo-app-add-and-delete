import { Todo } from './types/Todo';
import { FilterBy } from './types/typedefs';

export const getTodosByFilter = (visibleArray: Todo[], filter: FilterBy) => {
  return visibleArray.filter(({ completed }) => {
    switch (filter) {
      case FilterBy.ACTIVE:
        return !completed;

      case FilterBy.COMPLETED:
        return completed;

      default:
        return true;
    }
  });
};
