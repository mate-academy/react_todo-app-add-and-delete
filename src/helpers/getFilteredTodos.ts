import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getFilteredTodos(todos: Todo[], filter: Filter): Todo[] {
  return todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.Active:
        return !completed;

      case Filter.Completed:
        return completed;

      default:
        return true;
    }
  });
}
