import { Statuses } from '../types/Statuses';
import { Todo } from '../types/Todo';

export const getFilteredTasks = (todos: Todo[], filter: Statuses): Todo[] => {
  switch (filter) {
    case Statuses.All:
      return todos;

    case Statuses.Active:
      return todos.filter((todo) => !todo.completed);

    case Statuses.Completed:
      return todos.filter((todo) => todo.completed);

    default:
      return todos;
  }
};
