import { Todo, TodoFilter } from '../types';

export function filteredTodos(currentTodos: Todo[], filterBy: TodoFilter) {
  return currentTodos.filter(todo => {
    switch (filterBy) {
      case TodoFilter.Active:
        return !todo.completed;

      case TodoFilter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
}
