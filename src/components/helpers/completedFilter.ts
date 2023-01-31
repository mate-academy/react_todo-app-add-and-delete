import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

export const filterTodos = (
  todos: Todo[],
  complitedFilter: FilterType,
) => {
  switch (complitedFilter) {
    case FilterType.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FilterType.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
