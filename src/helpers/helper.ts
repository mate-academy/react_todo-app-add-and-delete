import { Todo } from '../types/Todo';
import { TypeOfFilter } from '../types/TypeOfFilters';

export const filterTodos = (
  todos: Todo[],
  filter: TypeOfFilter,
) => {
  if (filter === TypeOfFilter.Active) {
    return todos.filter(todo => !todo.completed);
  }

  if (filter === TypeOfFilter.Completed) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};
