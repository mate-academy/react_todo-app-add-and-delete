import { Todo } from '../types/Todo';
import { SortFields } from '../types/sortFields';

export function getVisibleTodos(todos: Todo[], sortField: SortFields) {
  switch (sortField) {
    case SortFields.active:
      return todos.filter(todo => !todo.completed);

    case SortFields.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}
