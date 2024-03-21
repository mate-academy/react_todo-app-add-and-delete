import { Status } from '../enums/Status';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filter: Status): Todo[] => {
  switch (filter) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
