import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export function getFilteredTodos(
  allTodos: Todo[],
  option: FilterOptions,
): Todo[] {
  const filteredTodos = [...allTodos];

  switch (option) {
    case FilterOptions.active:
      return filteredTodos.filter(todoItem => !todoItem.completed);
    case FilterOptions.completed:
      return filteredTodos.filter(todoItem => todoItem.completed);
    default:
      return filteredTodos;
  }
}
