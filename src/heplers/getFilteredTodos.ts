import { Todo } from '../types/Todo';
import { SortType } from '../enum/SortType';

export const getFilteredTodos = (initilaTodos:Todo[], sortType:SortType) => {
  const filteredTodos = [...initilaTodos];

  if (sortType) {
    switch (sortType) {
      case SortType.Active:
        return filteredTodos.filter(todo => !todo.completed);

      case SortType.Completed:
        return filteredTodos.filter(todo => todo.completed);

      default:
        return filteredTodos;
    }
  }

  return filteredTodos;
};
