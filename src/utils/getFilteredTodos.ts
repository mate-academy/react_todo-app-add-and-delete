import { FilterType } from '../types/ErrorType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], status: FilterType) => {
  switch (status) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);
    case FilterType.Completed:
      return todos.filter(todo => todo.completed);
    case FilterType.All:
    default:
      return todos;
  }
};
