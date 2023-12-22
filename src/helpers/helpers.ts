import { Filter } from '../types/Selected-filter-enum';
import { Todo } from '../types/Todo';

export const applySelectedTodos = (type: Filter, todos: Todo []) => {
  switch (type) {
    case Filter.active:
      return todos.filter(({ completed }) => completed === false);
    case Filter.completed:
      return todos.filter(({ completed }) => completed === true);
    default:
      return [...todos];
  }
};

export const applyUncompleted = (todos: Todo []): number => {
  return todos.filter(({ completed }) => completed === false).length;
};
