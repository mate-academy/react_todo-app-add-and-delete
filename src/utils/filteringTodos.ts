import { FilterOptions } from '../enums/FilterOptions';
import { Todo } from '../types/Todo';

export const filteredTodos = (todos: Todo[], filter: FilterOptions) =>
  todos.filter(todo => {
    switch (filter) {
      case FilterOptions.ACTIVE:
        return !todo.completed;
      case FilterOptions.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
