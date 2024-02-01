import { FilterParams } from '../types/FilterParams';
import { Todo } from '../types/Todo';

export function getFilteredTodos(todos: Todo[], filterParams: FilterParams) {
  let filteredTodos = [...todos];

  if (filterParams !== FilterParams.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (filterParams) {
        case FilterParams.Active:
          return !todo.completed;

        case FilterParams.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }

  return filteredTodos;
}
