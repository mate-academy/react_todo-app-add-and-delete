import { Todo } from '../types/Todo';
import { TodoStatusFilter } from '../types/TodoStatusFilter';

export const getPreparedTodos = (todos: Todo[], filter: TodoStatusFilter) => {
  switch (filter) {
    case TodoStatusFilter.Completed:
      return todos.filter(todo => todo.completed);
    case TodoStatusFilter.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
