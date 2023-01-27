import { CompletedFilter } from '../types/CompletedFilter';
import { Todo } from '../types/Todo';

export const filteredTodos = (
  todos: Todo[],
  completedFilter: CompletedFilter,
) => {
  return todos.filter(todo => {
    switch (completedFilter) {
      case CompletedFilter.All:
        return todo;

      case CompletedFilter.Active:
        return todo.completed === false;

      case CompletedFilter.Completed:
        return todo.completed === true;

      default:
        return null;
    }
  });
};
