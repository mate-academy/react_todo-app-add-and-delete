import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export function getPrepearedTodos(todos: Todo[], filter: FilterOptions) {
  let preparedTodos: Todo[] = [...todos];

  if (filter !== FilterOptions.ALL) {
    switch (filter) {
      case FilterOptions.ACTIVE:
        preparedTodos = preparedTodos.filter(todo => !todo.completed);
        break;

      case FilterOptions.COMPLETED:
        preparedTodos = preparedTodos.filter(todo => todo.completed);
        break;

      default:
        break;
    }
  }

  return preparedTodos;
}
