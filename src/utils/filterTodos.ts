import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filter: Status): Todo[] {
  switch (filter) {
    case Status.completed:
      return todos.filter(todo => todo.completed);

    case Status.active:
      return todos.filter(todo => !todo.completed);

    default:
      return todos;
  }
}
