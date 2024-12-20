import { StatusFilter } from '../types/StatusFilter';
import { Todo } from '../types/Todo';

// filters Todo list using certain status as a filter
export const filterTodos = (status: StatusFilter, todos: Todo[]) => {
  return todos.filter(todo => {
    switch (status) {
      case StatusFilter.Active:
        return !todo.completed;
      case StatusFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
