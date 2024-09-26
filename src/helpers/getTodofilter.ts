import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getTodoFilter = (todos: Todo[], filter: Filter) => {
  return todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
};
