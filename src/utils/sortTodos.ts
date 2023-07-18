import { SortType } from '../types/SortType';
import { Todo } from '../types/Todo';

export const filterTodos = (
  sortType: SortType,
  todos: Todo[],
) => {
  let filteredTodos = [...todos];

  switch (sortType) {
    case SortType.ACTIVE: {
      filteredTodos = filteredTodos.filter(todo => todo.completed === false);
      break;
    }

    case SortType.COMPLETED: {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;
    }

    case SortType.ALL:
    default: {
      return filteredTodos;
    }
  }

  return filteredTodos;
};
