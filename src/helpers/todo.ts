import { Todo } from '../types/Todo';

export const countActiveTodos = (todos: Todo[]) =>
  todos.filter(todo => !todo.completed).length;
export const isAlltodosCompleted = (todos: Todo[]) =>
  todos.every(todo => todo.completed);
