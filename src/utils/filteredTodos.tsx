import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const FilteredTodos = (todos: Todo[], filterBy: Status): Todo[] => {
  let filteredTodos = [...todos];

  if (filterBy) {
    switch (filterBy) {
      case Status.Active:
        return (filteredTodos = filteredTodos.filter(todo => !todo.completed));

      case Status.Completed:
        return (filteredTodos = filteredTodos.filter(todo => todo.completed));

      case Status.All:
      default:
        break;
    }
  }

  return filteredTodos;
};
