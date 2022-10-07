import { FilterType } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

export const getFilteredTodo = (filterType: FilterType, todos: Todo[]) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
