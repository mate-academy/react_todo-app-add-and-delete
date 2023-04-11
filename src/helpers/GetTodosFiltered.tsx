import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterType: FilterType) => {
  if (filterType !== FilterType.All) {
    return todos.filter(({ completed }) => {
      return filterType === FilterType.Active
        ? !completed
        : completed;
    });
  }

  return todos;
};
