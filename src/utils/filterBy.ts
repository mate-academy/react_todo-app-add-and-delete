import { Todo } from '../types/Todo';
import { FilterType } from '../types/TodoStatus';

export const filterBy = (todos: Todo[], type: FilterType) => {
  return todos.filter(({ completed }) => {
    switch (type) {
      case FilterType.Active: {
        return completed === false;
      }

      case FilterType.Completed: {
        return completed === true;
      }

      case FilterType.All:
      default: {
        return true;
      }
    }
  });
};
