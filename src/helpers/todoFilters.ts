import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const filterTodoByStatus = (status: TodoStatus) => {
  return (todo: Todo) => {
    switch (status) {
      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  };
};
