import { TodoFilter } from '../types/filter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filters: TodoFilter) => {
  return todos.filter(todo => {
    switch (filters) {
      case TodoFilter.Active:
        return !todo.completed;

      case TodoFilter.Completed:
        return todo.completed;

      case TodoFilter.All:
        return true;

      default:
        return true;
    }
  });
};
