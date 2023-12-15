import { Status } from './types/Status';
import { Todo } from './types/Todo';

type Arguments = {
  status: Status,
  todos: Todo[],
};

export const prepareTodos = ({
  todos,
  status,
}: Arguments) => {
  switch (status) {
    case Status.active:
      return todos.filter(todo => (
        !todo.completed
      ));

    case Status.completed:
      return todos.filter(todo => (
        todo.completed
      ));

    default:
      return todos;
  }
};
