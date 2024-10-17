import { Todo } from '../types';

export function countLeftTodos(todos: Todo[]) {
  return todos.reduce((amount, todo) => amount + (todo.completed ? 0 : 1), 0);
}
