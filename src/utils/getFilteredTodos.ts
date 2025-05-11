import { Filter as Status } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], status: Status) =>
  todos.filter(todo => {
    switch (status) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
