import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const prepareTodos = (currentFilter: Status, allTodos: Todo[]) => {
  switch (currentFilter) {
    case Status.all:
    default:
      return [...allTodos];
    case Status.active:
      return [...allTodos].filter((todo) => !todo.completed);
    case Status.completed:
      return [...allTodos].filter((todo) => todo.completed);
  }
};
