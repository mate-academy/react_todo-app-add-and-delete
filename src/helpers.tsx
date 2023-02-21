import { Todo } from './types/Todo';

export function activeTodosAmount(todos: Todo[]): number {
  return todos.filter(todo => !todo.completed).length;
}

export function completedTodosAmount(todos: Todo[]): number {
  return todos.filter(todo => todo.completed).length;
}
