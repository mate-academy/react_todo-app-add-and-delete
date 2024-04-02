import { Todo } from '../types/Todo';
import { Status } from '../types/enums';

export const USER_ID = 339;

type Params = {
  statusTodo: Status;
};

export const getPreparedTodos = (todos: Todo[], { statusTodo }: Params) => {
  return todos.filter(todo => {
    switch (statusTodo) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      case Status.All:
      default:
        return todo;
    }
  });
};
