import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getPraperedTodos(
  todos: Todo[],
  filter: Filter,
): Todo[] {
  return todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      case Filter.ALL:
      default:
        return true;
    }
  });
}
