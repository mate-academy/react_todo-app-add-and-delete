import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterType: FilterType) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return true;
      case FilterType.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};
