import { Todo } from '../types/Todo';

export enum Status {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const Filter = (todos: Todo[], selectedFilter: Status): Todo[] => {
  switch (selectedFilter) {
    case Status.all:
      return todos;

    case Status.active:
      return todos.filter(todo => !todo.completed);

    case Status.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
