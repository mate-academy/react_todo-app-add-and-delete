import { Status } from './types/Status';
import { Todo } from './types/Todo';

type TodoList = {
  status: Status,
  todos: Todo[],
};

export const prepareTodos = ({
  todos,
  status,
}: TodoList) => {
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
