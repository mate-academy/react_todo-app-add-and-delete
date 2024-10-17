import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

export const getFilteredTodos = (todos: Todo[], filter: FilterBy) => {
  return todos.filter(todo => {
    switch (filter) {
      case FilterBy.ACTIVE:
        return !todo.completed;

      case FilterBy.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });
};
