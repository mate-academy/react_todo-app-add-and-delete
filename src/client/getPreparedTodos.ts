import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export const getPreparedTodos = (
  todos: Todo[],
  filterOption: FilterOptions,
) => {
  let preparedTodos = todos;

  switch (filterOption) {
    case FilterOptions.Active:
      return (preparedTodos = todos.filter(todo => !todo.completed));
    case FilterOptions.Completed:
      return (preparedTodos = todos.filter(todo => todo.completed));
    default:
      return preparedTodos;
  }
};
