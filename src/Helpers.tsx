import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';

export const filterTodos = (
  todos: Todo[],
  filterOption: FilterOptions,
) => todos.filter(todo => {
  switch (filterOption) {
    case FilterOptions.ACTIVE:

      return !todo.completed;

    case FilterOptions.COMPLETED:

      return todo.completed;

    default:
      return todos;
  }
});
