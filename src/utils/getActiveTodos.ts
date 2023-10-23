import { Todo } from '../types/Todo';

export const getActiveTodos = (
  todos: Todo[],
) => todos.filter(({ completed }) => !completed);
