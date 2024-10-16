import { Todo } from './../types/Todo';
import { FilterOptions } from './../types/FilterOptions';

export function getFilteredTodos(todos: Todo[], filterBy: FilterOptions) {
  return todos.filter(todo => {
    switch (filterBy) {
      case FilterOptions.COMPLETED:
        return todo.completed;
      case FilterOptions.ACTIVE:
        return !todo.completed;
      default:
        return true;
    }
  });
}
