import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function prepareTodos(todos: Todo[], filterType: FilterType): Todo[] {
  let preparedTodos = [...todos];

  if (filterType) {
    switch (filterType) {
      case FilterType.Active:
        preparedTodos = todos.filter(todo => !todo.completed);
        break;
      case FilterType.Completed:
        preparedTodos = todos.filter(todo => todo.completed);
        break;
      default:
        preparedTodos = [...todos];
    }
  }

  return preparedTodos;
}
