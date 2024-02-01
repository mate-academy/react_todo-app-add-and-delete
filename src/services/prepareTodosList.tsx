import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function prepareTodosList(listOfTodos: Todo[], filterField: Status) {
  return listOfTodos.filter(todo => {
    switch (filterField) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
}
