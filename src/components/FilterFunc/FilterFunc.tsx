import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

export function getFilter(todos: Todo[], sortField: SortType) {
  switch (sortField) {
    case SortType.Active:
      return todos.filter(todo => !todo.completed);
    case SortType.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
