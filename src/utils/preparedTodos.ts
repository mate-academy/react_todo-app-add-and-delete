import { Todo, Status } from '../types/Todo';

export const prepareTodos = (filter: Status, preparedTodos: Todo[]) => {
  switch (filter) {
    case Status.ACTIVE:
      return [...preparedTodos].filter(todo => !todo.completed);
    case Status.COMPLETED:
      return [...preparedTodos].filter(todo => todo.completed);
    case Status.ALL:
    default:
      return [...preparedTodos];
  }
};
