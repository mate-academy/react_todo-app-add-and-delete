import { Todo } from '../types/TodoProps';
import { FilterStatus } from '../types/FilterButtonsProps';

type FilterOptions = {
  query?: string;
  status: FilterStatus;
};

export function filteredTodos(
  todos: Todo[],
  { query = '', status }: FilterOptions,
): Todo[] {
  return todos.filter(todo => {
    if (todo.isTemp) {
      return true;
    }

    const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) {
      return false;
    }

    if (status === FilterStatus.Active) {
      return !todo.completed;
    }

    if (status === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });
}
