import { FilterType } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterType: FilterType) => {
  switch (filterType) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);
    case FilterType.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
