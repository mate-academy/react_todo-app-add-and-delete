import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], sortedStatus: Filter) => {
  return todos.filter(todo => {
    switch (sortedStatus) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ALL:
        return true;
      default:
        return false;
    }
  });
};
