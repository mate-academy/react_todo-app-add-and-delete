import { Status, Todo } from '../types/Todo';

export function getFilteredTodos(allTodos: Todo[], statusFilter: Status) {
  return allTodos.filter(todo => {
    switch (statusFilter) {
      case Status.active:
        return !todo.completed;
      case Status.completed:
        return todo.completed;
      default:
        return true;
    }
  });
}

export function getActiveTodos(allTodos: Todo[]) {
  return allTodos.filter(todo => !todo.completed);
}
