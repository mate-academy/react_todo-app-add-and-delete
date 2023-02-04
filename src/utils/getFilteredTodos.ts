import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

export const getFilteredTodos = (todos: Todo[], filterType: FilterBy) => (
  todos.filter(({ completed }) => {
    switch (filterType) {
      case FilterBy.ALL:
        return true;

      case FilterBy.ACTIVE:
        return !completed;

      case FilterBy.COMPLETED:
        return completed;

      default:
        throw new Error('Incorrect filter type');
    }
  })
);
