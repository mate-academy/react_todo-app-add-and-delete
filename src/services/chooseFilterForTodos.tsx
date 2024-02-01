import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterForTodos(queryForFilter: string, todos: Todo[]) {
  return todos.filter(todo => {
    switch (queryForFilter) {
      case Status.Active:
        return todo.completed === false;

      case Status.Completed:
        return todo.completed === true;

      default:
        return true;
    }
  });
}
