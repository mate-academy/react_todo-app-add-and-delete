import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const filterTodos = (todos: Todo[], selectedFilter: FilterType) => {
  switch (selectedFilter) {
    case FilterType.All:
      return todos;

    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
