import { FilterOption } from '../types/Filter';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filter: FilterOption): Todo[] {
  switch (filter) {
    case FilterOption.all:
      return todos;
    case FilterOption.active:
      return todos.filter(todo => !todo.completed);
    case FilterOption.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
