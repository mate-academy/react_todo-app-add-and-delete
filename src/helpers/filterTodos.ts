import { TodoFilter } from '../types/Filters';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filter: TodoFilter) => {
  return todos.filter(todo => {
    switch (filter) {
      case TodoFilter.All:
        return todo;
      case TodoFilter.Completed:
        return todo.completed;
      case TodoFilter.Active:
        return !todo.completed;
      default:
        return todo;
    }
  });
};
