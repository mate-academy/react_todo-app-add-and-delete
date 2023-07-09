import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { getFilteredBy } from './getFilteredBy';
import { filterTodoByStatus } from './todoFilters';

export const getFilteredTodos = (
  todos: Todo[],
  status: TodoStatus,
) => {
  const filters = [];

  if (status !== TodoStatus.All) {
    filters.push(filterTodoByStatus(status));
  }

  if (!filters.length) {
    return todos;
  }

  return getFilteredBy(todos, ...filters);
};
