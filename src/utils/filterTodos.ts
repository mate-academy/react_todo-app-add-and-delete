import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function filterTodos(filterType: FilterType, list: Todo[]): Todo[] {
  switch (filterType) {
    case FilterType.Active:
      return list.filter(todo => !todo.completed);
    case FilterType.Completed:
      return list.filter(todo => todo.completed);
    case FilterType.All:
    default:
      return list;
  }
}
