import { SortType } from '../types/SortType';
import { Todo } from '../types/Todo';

export const filterTodos = (
  sortType: SortType,
  todos: Todo[],
) => {
  switch (sortType) {
    case SortType.ACTIVE: {
      return todos.filter(todo => todo.completed === false);
    }

    case SortType.COMPLETED: {
      return todos.filter(todo => todo.completed);
    }

    case SortType.ALL:
    default: {
      return todos;
    }
  }
};
