import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], filterType: FilterTypes) => {
  return [...todos].filter(todo => {
    switch (filterType) {
      case FilterTypes.COMPLETED:
        return todo.completed;

      case FilterTypes.ACTIVE:
        return !todo.completed;

      default:
        return true;
    }
  });
};
