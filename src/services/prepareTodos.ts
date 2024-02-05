import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function prepareTodos(todos: Todo[], filterField: Status) {
  switch (filterField) {
    case Status.Active:
      return todos.filter(({ completed }) => !completed);
    case Status.Completed:
      return todos.filter(({ completed }) => completed);
    default:
      return todos;
  }
}
