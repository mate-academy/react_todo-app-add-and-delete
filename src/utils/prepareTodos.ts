import { Todo } from '../types/Todo';
import { SortType } from '../types/SortType';

export const prepareTodos = (todos: Todo[], sortType: SortType): Todo[] => {
  let visibleTodos = [...todos];

  visibleTodos = visibleTodos.filter(todo => {
    switch (sortType) {
      case SortType.ACTIVE:
        return !todo.completed;

      case SortType.COMPLETED:
        return todo.completed;

      case SortType.ALL:
      default:
        return true;
    }
  });

  return visibleTodos;
};
