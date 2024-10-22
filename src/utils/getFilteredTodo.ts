import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterType) => {
  switch (filterBy) {
    case FilterType.completed:
      return todos.filter(todo => todo.completed === true);
    case FilterType.active:
      return todos.filter(todo => todo.completed === false);
    default:
      return todos;
  }
};
