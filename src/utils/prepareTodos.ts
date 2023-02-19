import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const prepareTodos = (filter: FilterBy, preparedTodos: Todo[]) => {
  switch (filter) {
    case FilterBy.ACTIVE:
      return [...preparedTodos].filter(todo => !todo.completed);
    case FilterBy.COMPLETED:
      return [...preparedTodos].filter(todo => todo.completed);
    case FilterBy.ALL:
    default:
      return [...preparedTodos];
  }
};
