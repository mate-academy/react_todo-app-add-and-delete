import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterStatus: FilterStatus) => {
  if (filterStatus !== FilterStatus.ALL) {
    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.ACTIVE:
          return !todo.completed;

        case FilterStatus.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    });
  }

  return todos;
};
