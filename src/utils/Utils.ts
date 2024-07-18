import { Todo } from '../types/Todo';

export const allCompletedTodos = (todos: Todo[]) =>
  todos.every(todo => todo.completed);

export const hasCompletedTodos = (todos: Todo[]) =>
  todos.some(todo => todo.completed);
