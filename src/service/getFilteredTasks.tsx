import { Statuses } from '../types/Statuses';
import { Todo } from '../types/Todo';

export const getFilteredTasks = (todos: Todo[], filter: Statuses): Todo[] => {
  switch (filter) {
    case Statuses.All:
      return todos;

    case Statuses.Active:
      return todos.filter((todo) => todo.completed === false);

    case Statuses.Completed:
      return todos.filter((todo) => todo.completed === true);

    default:
      return todos;
  }
};
