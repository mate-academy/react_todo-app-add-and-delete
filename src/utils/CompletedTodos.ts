import { Todo } from '../types/Todo';

export function completedTodos(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}
