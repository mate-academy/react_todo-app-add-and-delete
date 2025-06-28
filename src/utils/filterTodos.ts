import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], status: Filter) => {
  return todos.filter(todo => {
    switch (status) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default:
        return todo;
    }
  });
};
