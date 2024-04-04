import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

export function getFilteredTodos(
  todos: Todo[],
  filterOption: FilterStatus,
): Todo[] {
  let filteredTodos = todos;

  if (filterOption !== FilterStatus.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (filterOption) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return;
      }
    });
  }

  return filteredTodos;
}
