import { Todo } from '../types/Todo';
import { SortType } from '../types/SortType';

export const filteredTodos = (allTodos: Todo[], sortField: string) => {
  switch (sortField) {
    case SortType.Active:
      return allTodos.filter((todo) => !todo.completed);
    case SortType.Completed:
      return allTodos.filter((todo) => todo.completed);
    case SortType.All:
    default:
      return allTodos;
  }
};
