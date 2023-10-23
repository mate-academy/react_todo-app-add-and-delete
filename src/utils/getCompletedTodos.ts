import { Todo } from '../types/Todo';

export const getCompletedTodos = (
  todos: Todo[],
) => todos.filter(({ completed }) => completed);
