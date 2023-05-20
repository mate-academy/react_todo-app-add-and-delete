import { Todo } from '../types/types/Todo';
import { TodoStatus } from '../types/types/TodoStatus';

export const filteredTodos = (todos: Todo[], filteredBy: TodoStatus) => {
  const filteredTodos = todos.filter(todo => {
    switch (filteredBy) {
      case TodoStatus.ALL:
        return todo;
      case TodoStatus.ACTIVE:
        return todo.completed === false;
      case TodoStatus.COMPLETED:
        return todo.completed === true;
      default:
        return false;
    }
  });

  return filteredTodos;
};
