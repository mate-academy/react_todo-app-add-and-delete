import { Todo } from '../types/Todo';

export const countActiveTodos = (todos: Todo[]) => (
  todos.filter(({ completed }) => !completed).length
);
