import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const getFiltredTodos = (todos: Todo[], filter: TodoStatus) => {
  switch (filter) {
    case TodoStatus.completed:
      return todos.filter(todo => todo.completed);
    case TodoStatus.active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
