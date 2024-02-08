import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function getFilteredTodos(filter: Status, todos: Todo[]) {
  switch (filter) {
    case Status.Active:
      return todos.filter(({ completed }) => !completed);
    case Status.Completed:
      return todos.filter(({ completed }) => completed);
    default:
      return todos;
  }
}
