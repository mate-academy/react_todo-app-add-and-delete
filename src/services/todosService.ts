import { Status } from '../enums/Status';
import { Todo } from '../types/Todo';

export const getActiveTodos = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed);
};

export const getCompletedTodos = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed);
};

export const getFilteredTodos = (todos: Todo[], filter: Status) => {
  switch (filter) {
    case Status.Active:
      return getActiveTodos(todos);
    case Status.Completed:
      return getCompletedTodos(todos);
    default:
      return todos;
  }
};
