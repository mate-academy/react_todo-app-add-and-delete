import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function prepareTodos(allTodos: Todo[], filterBy: Status) {
  switch (filterBy) {
    case Status.Active:
      return allTodos.filter(todo => !todo.completed);

    case Status.Completed:
      return allTodos.filter(todo => todo.completed);

    default:
      return allTodos;
  }
}
