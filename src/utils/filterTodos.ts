import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  switch (filter) {
    case Filter.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case Filter.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
