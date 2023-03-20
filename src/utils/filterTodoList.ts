import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export function filterTodoList(array: Todo[], filterBy: FilterType): Todo[] {
  if (filterBy === FilterType.All) {
    return array;
  }

  return array.filter(({ completed }) => {
    if (filterBy === FilterType.Active) {
      return !completed;
    }

    return completed;
  });
}

export const getMountCompletedTodos = (todos: Todo[]): number => {
  return todos.filter(({ completed }) => !completed).length;
};
