import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filteredTodos(
  allTodos: Todo[] | undefined,
  filter: Status,
): Todo[] | null {
  if (!allTodos) {
    return null;
  }

  return allTodos.filter(t => {
    switch (filter) {
      case Status.ACTIVE:
        return !t.completed;

      case Status.COMPLETED:
        return t.completed;

      default:
        return true;
    }
  });
}
