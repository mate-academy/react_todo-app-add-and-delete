import { Todo } from '../types/Todo';

export enum Status {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const filterTodo = (todos: Todo[], filter: Status): Todo[] => {
  switch (filter) {
    case Status.All:
      return todos;
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
