import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/FilterTypes';

export const getPreparedTodos = (
  todos: Todo[],
  filterInstructions: string,
): Todo[] => {
  return todos.filter(todo => {
    switch (filterInstructions) {
      case FilterTypes.Active:
        return !todo.completed;
      case FilterTypes.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
