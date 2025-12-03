import { Todo } from '../types/Todo';
import { FilterType, FILTERS } from '../constants/filters';

export const selectFilteredTodos = (
  todos: Todo[],
  filter: FilterType,
): Todo[] => {
  switch (filter) {
    case FILTERS.ACTIVE:
      return todos.filter(t => !t.completed);
    case FILTERS.COMPLETED:
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
};

export const selectActiveCount = (todos: Todo[]): number =>
  todos.filter(t => !t.completed).length;

export const selectHasCompleted = (todos: Todo[]): boolean =>
  todos.some(t => t.completed);

export const selectAllCompleted = (todos: Todo[]): boolean =>
  todos.length > 0 && todos.every(t => t.completed);
