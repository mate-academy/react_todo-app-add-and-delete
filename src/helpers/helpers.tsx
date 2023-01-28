import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

// eslint-disable-next-line max-len
export const getFilteredTodos = (filterTodos: Todo[], filterType: FilterTypes) => {
  return filterTodos.filter(todo => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return !todo.completed;

      case FilterTypes.COMPLETED:
        return todo.completed;

      case FilterTypes.ALL:
      default:
        return true;
    }
  });
};
