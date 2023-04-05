import { Todo } from '../types/Todo';

import { FilterType } from '../enums/FilterType';

export function filterTodos(
  todos: Todo[],
  selectedFilter: FilterType,
): Todo[] {
  return todos.filter((todo) => {
    switch (selectedFilter) {
      case FilterType.active:
        return !todo.completed;

      case FilterType.completed:
        return todo.completed;

      case FilterType.all:
      default:
        return todo;
    }
  });
}
