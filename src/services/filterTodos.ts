import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filterOpitons: FilterOptions) {
  switch (filterOpitons) {
    case FilterOptions.Active:
      return todos.filter(({ completed }) => !completed);

    case FilterOptions.Completed:
      return todos.filter(({ completed }) => completed);

    default:
      return [...todos];
  }
}
