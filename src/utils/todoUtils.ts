import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

export function getFilteredTodos(todos: Todo[], filter: TodoStatus): Todo[] {
  switch (filter) {
    case TodoStatus.Active:
      return todos.filter(todo => !todo.completed);
    case TodoStatus.Completed:
      return todos.filter(todo => todo.completed);
    case TodoStatus.All:
    default:
      return [...todos];
  }
}

export function getActiveTodosCount(todos: Todo[]): number {
  return todos.filter(todo => !todo.completed).length;
}
