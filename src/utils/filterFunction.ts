import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getPreparedTodos = (
  todos: Todo[],
  filterType: FilterType,
) => {
  let copyTodos = [...todos];

  switch (filterType) {
    case FilterType.Active:
      copyTodos = copyTodos.filter(todo => !todo.completed);
      break;
    case FilterType.Completed:
      copyTodos = copyTodos.filter(todo => todo.completed);
      break;

    case FilterType.All:
    default:
      return copyTodos;
  }

  return copyTodos;
};
