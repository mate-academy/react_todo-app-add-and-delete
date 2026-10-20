import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

export const getVisibleTodos = (todos: Todo[], status: Status): Todo[] => {
  return todos.filter(({ completed }) => {
    switch (status) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      default:
        return true;
    }
  });
};
