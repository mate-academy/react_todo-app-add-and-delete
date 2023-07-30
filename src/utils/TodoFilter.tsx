import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function getFilteredTodos(
  todos: Todo[],
  filterType: FilterType,
) {
  let filteredTodos = [...todos!];

  if (filterType) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (filterType) {
        case 'all':
          return todo;

        case 'active':
          return todo.completed === false;

        case 'completed':
          return todo.completed === true;

        default:
          return todo;
      }
    });
  }

  return filteredTodos;
}
