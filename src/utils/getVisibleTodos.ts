import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function getVisibleTodos(newTodos: Todo[], newStatus: Status) {
  switch (newStatus) {
    case Status.Active:
      return newTodos.filter(todo => !todo.completed);

    case Status.Completed:
      return newTodos.filter(todo => todo.completed);

    default:
      return newTodos;
  }
}
