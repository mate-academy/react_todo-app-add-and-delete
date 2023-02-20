import { Todo } from '../types/Todo';

export enum Filters {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const filterTodos = (todos: Todo[], filter: Filters): Todo[] => {
  switch (filter) {
    case Filters.Active:
      return todos.filter((todo) => !todo.completed);
    case Filters.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};
