import { Todo } from '../Types/TodoType';

export const isAllTodosCompleted = (todos: Todo[]) =>
  todos.every(todo => todo.completed);

export const hasTodoCompleted = (todos: Todo[]) =>
  todos.some(todo => todo.completed);
