import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (initialTodos: Todo[], filter: Filter) => {
  return [...initialTodos].filter(({ completed }) => {
    switch (filter) {
      case Filter.ACTIVE:
        return !completed;
      case Filter.COMPLETED:
        return completed;
      default:
        return true;
    }
  });
};
