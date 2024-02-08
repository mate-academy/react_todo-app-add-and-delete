import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterByStatus(todos: Todo[], status: Status) {
  const filteredData = todos.filter((todo) => {
    switch (status) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return filteredData;
}
