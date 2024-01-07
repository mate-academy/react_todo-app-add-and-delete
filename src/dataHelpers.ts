import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const filterTodos = (
  todos: Todo[],
  filterStatus: Status,
  query?: string,
) => {
  let todosCopy = [...todos];

  if (query) {
    todosCopy = todosCopy
      .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));
  }

  switch (filterStatus) {
    case Status.Active:
      todosCopy = todosCopy.filter(todo => !todo.completed);
      break;
    case Status.Completed:
      todosCopy = todosCopy.filter(todo => todo.completed);
      break;
    case Status.All:
      todosCopy = [...todosCopy];
      break;
    default:
      throw new Error('not filter');
  }

  return todosCopy;
};
