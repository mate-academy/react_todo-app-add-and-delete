import { Todo } from '../types/Todo';

enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const getVisibleTodos = (sort: SortType, todos: Todo[]): Todo[] => {
  switch (sort) {
    case SortType.Active:
      return todos.filter(todo => !todo.completed);

    case SortType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
