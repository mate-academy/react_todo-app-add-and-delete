import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilterTodos = (todos: Todo[], completedFilter: Filter) => {
  return todos.filter(todo => {
    switch (completedFilter) {
      case Filter.completed:
        return todo.completed;

      case Filter.active:
        return !todo.completed;

      default:
        return todo;
    }
  });
};
