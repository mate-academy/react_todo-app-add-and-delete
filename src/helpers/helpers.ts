import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export const filterTodosByCompleted = (
  todos: Todo[],
  completedFilter: FilterType,
) => {
  switch (completedFilter) {
    case FilterType.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FilterType.COMPLETED:
      return todos.filter(todo => todo.completed);

    case FilterType.ALL:
    default:
      return [...todos];
  }
};
