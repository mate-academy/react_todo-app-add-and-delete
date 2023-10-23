import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';

export const getFilteredTodos = (
  todos: Todo[],
  selectedFilter: string,
) => {
  let preparedTodos = [...todos];

  if (selectedFilter !== TodoFilter.All) {
    preparedTodos = preparedTodos.filter(({ completed }) => {
      switch (selectedFilter) {
        case TodoFilter.Active:
          return !completed;

        case TodoFilter.Completed:
          return completed;

        default:
          throw new Error('Something went wrong :(');
      }
    });
  }

  return preparedTodos;
};
