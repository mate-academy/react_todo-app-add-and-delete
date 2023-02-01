import { Todo } from '../types/Todo';

export enum Filter {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const filterTodos = (filteredTodos: Todo[], filteredBy: Filter) => {
  return filteredTodos.filter(todo => {
    switch (filteredBy) {
      case Filter.active:
        return !todo.completed;

      case Filter.completed:
        return todo.completed;

      case Filter.all:
      default:
        return todo;
    }
  });
};
