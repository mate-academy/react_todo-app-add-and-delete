import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

export function filterTodos(todos: Todo[], selectedFilter: TodoStatus): Todo[] {
  return todos.filter((todo) => {
    switch (selectedFilter) {
      case TodoStatus.All:
        return true;

      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}
