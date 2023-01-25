import { FilterType } from '../../types/FiltersType';
import { Todo } from '../../types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  completedFilter: FilterType,
) => {
  return todos.filter(todo => {
    switch (completedFilter) {
      case FilterType.active:
        return !todo.completed;

      case FilterType.completed:
        return todo.completed;

      case FilterType.all:
      default:
        return true;
    }
  });
};
