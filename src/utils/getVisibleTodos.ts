import { Todo } from '../types/Todo';
import { FilterType } from '../enums/FilterType';

export const getVisibleTodos = (
  todos: Todo[],
  filterType: FilterType,
): Todo[] => {
  let visibleTodos = todos;

  switch (filterType) {
    case FilterType.ACTIVE:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case FilterType.COMPLETED:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    default:
      break;
  }

  return visibleTodos;
};
