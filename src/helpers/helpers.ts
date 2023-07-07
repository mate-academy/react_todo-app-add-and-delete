import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterType: FilterStatus) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterStatus.active:
        return !todo.completed;

      case FilterStatus.completed:
        return todo.completed;

      default:
        return todo;
    }
  });
};
