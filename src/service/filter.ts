import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], status: Status) => {
  switch (status) {
    case Status.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Status.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
