import { Todo } from '../types/Todo';
import { TypeOfFilter } from '../types/TypeOfFilters';

export const filterTodos = (
  todos: Todo[],
  filter: TypeOfFilter,
) => {
  switch (filter) {
    case TypeOfFilter.Active:
      return todos.filter(todo => !todo.completed);
    case TypeOfFilter.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
