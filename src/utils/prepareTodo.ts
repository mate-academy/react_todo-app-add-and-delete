import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export function prepareTodo(todos: Todo[], filterBy: FilterBy):Todo[] {
  return todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.ACTIVE:
        return !todo.completed;
      case FilterBy.COMPLETED:
        return todo.completed;
      case FilterBy.ALL:
        return true;
      default:
        throw new Error('Unexpected filterBy value');
    }
  });
}
