import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const FilteredTodos = (todos: Todo[], filterBy: Status): Todo[] => {
  if (filterBy) {
    switch (filterBy) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      case Status.All:
      default:
        return todos;
    }
  }

  return todos;
};
