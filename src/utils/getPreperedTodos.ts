import { Todo } from '../types/Todo';
import { TodoState } from '../types/TodoState';

export const getPreparedTodos = (todos: Todo[], filter: TodoState) => {
  switch (filter) {
    case TodoState.COMPLETED:
      return todos.filter(todo => todo.completed);
    case TodoState.ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
