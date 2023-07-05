import { FilterType } from './types/HelperTypes';
import { Todo } from './types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  filterType: FilterType,
): Todo[] => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.ALL:
        return todo;
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      default:
        throw Error('Error in filtering');
    }
  });
};
