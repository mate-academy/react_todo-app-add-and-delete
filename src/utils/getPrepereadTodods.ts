import { FilterParams } from '../types/FilterParams';
import { Todo } from '../types/Todo';

export function getPreperedTodos(
  todosForFilter: Todo[],
  filterField: FilterParams,
) {
  return todosForFilter.filter(todo => {
    switch (filterField) {
      case FilterParams.active:
        return !todo.completed;
      case FilterParams.completed:
        return todo.completed;
      default:
        return todo;
    }
  });
}
