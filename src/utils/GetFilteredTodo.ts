import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export function getFilteredTodo(todos: Todo[], selectedStatus: TodoStatus) {
  return todos.filter(todo => {
    switch (selectedStatus) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
}
