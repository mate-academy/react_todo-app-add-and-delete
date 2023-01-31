import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (filteredTodos: Todo[],
  filterOption: Filters) => {
  return filteredTodos.filter(todo => {
    switch (filterOption) {
      case Filters.ACTIVE:
        return !todo.completed;

      case Filters.COMPLETED:
        return todo.completed;

      case Filters.ALL:
      default:
        return true;
    }
  });
};
