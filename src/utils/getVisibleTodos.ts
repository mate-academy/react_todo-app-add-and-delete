import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

export const getVisibleTodos = (todos: Todo[], status: Status) => {
  switch (status) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);

    case Status.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
