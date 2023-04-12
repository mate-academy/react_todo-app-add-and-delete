import { Todo } from '../types/Todos';
import { FilterType } from '../types/FilterType';

export const getActiveTodos = (todos: Todo[]) => {
  return todos.reduce((acc, { completed }) => {
    return completed
      ? acc
      : acc + 1;
  }, 0);
};

export const getFilteredTodos = (
  todos: Todo[],
  filterType: FilterType,
) => {
  return todos.filter((todo) => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
        return todo.completed;

      default:
        return todo;
    }
  });
};
