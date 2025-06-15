import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function getVisibleTodos(todos: Todo[], filter: string) {
  switch (filter) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    case FilterType.All:
    default:
      return todos;
  }
}
