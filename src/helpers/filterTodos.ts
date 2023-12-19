import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodos(todosList: Todo[], status: Status) {
  switch (status) {
    case Status.ACTIVE:
      return todosList.filter(todo => !todo.completed);

    case Status.COMPLETED:
      return todosList.filter(todo => todo.completed);

    default:
      return todosList;
  }
}
