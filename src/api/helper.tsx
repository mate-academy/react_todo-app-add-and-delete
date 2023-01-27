import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getTodoFilteredByCompleted = (
  todos: Todo[],
  filterStatus: string,
) => {
  return todos.filter((todo) => {
    switch (filterStatus) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
};
