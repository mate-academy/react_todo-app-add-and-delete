import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';

export const filterTodos = (filterState: FilterOptions, todos: Todo[]) => {
  if (filterState === FilterOptions.All) {
    return todos;
  }

  return todos.filter(todo =>
    filterState === FilterOptions.Active ? !todo.completed : todo.completed,
  );
};
