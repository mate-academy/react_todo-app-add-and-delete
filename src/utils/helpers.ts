import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export const getFilteredTodos = (
  todos: Todo[],
  filterMethod: FilterType,
): Todo[] => {
  switch (filterMethod) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
