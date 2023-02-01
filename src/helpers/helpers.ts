import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/FilterTypes';

export const filterTodosByCompleted = (
  todos: Todo[],
  completedFilter: FilterTypes,
) => {
  switch (completedFilter) {
    case FilterTypes.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FilterTypes.COMPLETED:
      return todos.filter(todo => todo.completed);

    case FilterTypes.ALL:
    default:
      return [...todos];
  }
};
