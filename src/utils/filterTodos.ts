import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filter: FilterOptions) => {
  return todos.filter(todo => {
    switch (filter) {
      case FilterOptions.Active:
        return !todo.completed;

      case FilterOptions.Completed:
        return todo.completed;

      case FilterOptions.All:
      default:
        return true;
    }
  });
};
