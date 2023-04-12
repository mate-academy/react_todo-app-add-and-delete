import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

export const filterTodos = (
  todos: Todo[],
  sortBy: SortType,
): Todo[] => {
  return todos.filter(todo => {
    let isSort = true;

    switch (sortBy) {
      case SortType.ACTIVE:
        isSort = !todo.completed;
        break;

      case SortType.COMPLETED:
        isSort = todo.completed;
        break;

      default:
        break;
    }

    return isSort;
  });
};
