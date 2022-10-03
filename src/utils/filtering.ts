import { Todo } from '../types/Todo';

export function getActiveTodos(todos: Todo[]) {
  return todos.filter(todo => !todo.completed);
}

export function getCompletedTodos(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}
