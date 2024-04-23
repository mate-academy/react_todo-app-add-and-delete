import { Todo } from '../types/Todo';
import { FilterStatus } from './FilterStatus';

export function getFilteredTodos(todos: Todo[], query: string) {
  const preparedTodos = todos.filter(todo => {
    switch (query) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todos;
    }
  });

  return preparedTodos;
}
