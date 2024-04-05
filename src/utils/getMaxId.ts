import { Todo } from '../types/Todo';

export function getMaxId(todos: Todo[]) {
  return Math.max(...todos.map(todo => todo.id));
}
