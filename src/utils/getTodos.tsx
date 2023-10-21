import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const getActiveTodos = (
  todos: Todo[],
) => todos.filter(({ completed }) => !completed);

export const getCompletedTodos = (
  todos: Todo[],
) => todos.filter(({ completed }) => completed);

export const getFilteredTodos = (
  todos: Todo[],
  selectedFilter: string,
) => {
  const preparedTodos = [...todos];

  switch (selectedFilter) {
    case Filter.Active:
      return preparedTodos.filter(({ completed }) => {
        return !completed;
      });
    case Filter.Completed:
      return preparedTodos.filter(({ completed }) => {
        return completed;
      });
    case Filter.All:
      return preparedTodos;
    default:
      throw new Error('Wrong filter input');
  }
};
