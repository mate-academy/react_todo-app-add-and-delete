import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case FilterType.Active:
      return todos.filter((todo) => !todo.completed);
    case FilterType.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};
