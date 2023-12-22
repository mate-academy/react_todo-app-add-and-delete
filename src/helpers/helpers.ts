import { Filter } from '../types/Selected-filter-enum';
import { Todo } from '../types/Todo';

export const applySelectedTodos = (type: Filter, todos: Todo []) => {
  switch (type) {
    case Filter.active:
      return todos.filter(({ completed }) => !completed);
    case Filter.completed:
      return todos.filter(({ completed }) => completed);
    default:
      return [...todos];
  }
};

export const applyUncompleted = (todos: Todo []): number => {
  return todos.filter(({ completed }) => !completed).length;
};

export const applyHasCompleted = (todos: Todo []) => {
  return todos.some(({ completed }) => completed);
};

export const removeTodo = (todoId: number, todos: Todo []) => {
  return todos.filter(({ id }) => todoId !== id);
};
