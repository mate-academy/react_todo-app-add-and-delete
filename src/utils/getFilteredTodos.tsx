import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filter: Status) => {
  return todos.filter(({ completed }) => {
    switch (filter) {
      case Status.active:
        return !completed;
      case Status.completed:
        return completed;
      default:
        return todos;
    }
  });
};
