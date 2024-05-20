import { SortField } from '../types/SortField';
import { Todo } from '../types/Todo';

export function getSortedTodos(todos: Todo[], sortField: SortField) {
  switch (sortField) {
    case SortField.Active:
      return todos.filter(todo => !todo.completed);
    case SortField.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
