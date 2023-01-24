import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterType: FilterTypes) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return !todo.completed;

      case FilterTypes.COMPLETED:
        return todo.completed;

      case FilterTypes.ALL:
      default:
        return true;
    }
  });
};
