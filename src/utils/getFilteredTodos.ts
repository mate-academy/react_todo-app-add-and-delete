import { Todo } from '../types/Todo';
import { StatesOfFilter } from '../types/StatesOfFilter';

export function getFilteredTodos(
  todos: Todo[],
  filterOption: StatesOfFilter,
): Todo[] {
  let filteredTodos = todos;

  if (filterOption !== StatesOfFilter.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (filterOption) {
        case StatesOfFilter.Active:
          return !todo.completed;

        case StatesOfFilter.Completed:
          return todo.completed;

        default:
          return;
      }
    });
  }

  return filteredTodos;
}
