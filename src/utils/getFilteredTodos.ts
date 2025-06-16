import { StatusFilterOptions } from '../types/StatusFilterOptions';
import { Todo } from '../types/Todo';

interface GetFilteredTodosFilter {
  status: StatusFilterOptions;
}

export function getFilteredTodos(
  todos: Todo[],
  filters: GetFilteredTodosFilter,
) {
  let filteredTodos = [...todos];

  if (filters.status !== StatusFilterOptions.all) {
    filteredTodos = filteredTodos.filter(todo => {
      if (filters.status === StatusFilterOptions.completed) {
        return todo.completed;
      } else {
        return !todo.completed;
      }
    });
  }

  return filteredTodos;
}
