import { FilterStatuses } from '../data/enums';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (status: string, todos: Todo[]) => {
  switch (status) {
    case FilterStatuses.All:
      return todos;
    case FilterStatuses.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatuses.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
