import { Status } from './types/Status';
import { Todo } from './types/Todo';

export function preperedTodos(
  todos: Todo[],
  selectFilter: Status,
): Todo[] {
  let filteredTodo = [...todos];

  if (selectFilter) {
    switch (selectFilter) {
      case (Status.ACTIVE):
        filteredTodo = filteredTodo.filter(todo => !todo.completed);
        break;

      case (Status.COMPLETED):
        filteredTodo = filteredTodo.filter(todo => todo.completed);
        break;

      default:
        return filteredTodo;
    }
  }

  return filteredTodo;
}
