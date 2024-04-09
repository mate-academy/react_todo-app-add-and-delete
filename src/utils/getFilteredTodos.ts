import { FilterOption } from '../enums/FilterOption';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterOption) => {
  switch (filterBy) {
    case FilterOption.Active:
      return todos.filter(todo => !todo.completed);
    case FilterOption.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
