import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export function getFilteredTodos(todosToFilter: Todo[], filter: FilterType) {
  switch (filter) {
    case FilterType.Active:
      return todosToFilter.filter(todo => !todo.completed);
    case FilterType.Completed:
      return todosToFilter.filter(todo => todo.completed);
    default:
      return todosToFilter;
  }
}
