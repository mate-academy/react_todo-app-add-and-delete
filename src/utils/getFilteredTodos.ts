import { FilterStatus } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], status: FilterStatus) =>
  todos.filter(todo => {
    switch (status) {
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
