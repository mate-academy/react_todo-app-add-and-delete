import { Todo } from '../types/Todo';

export const countTodos = (
  todos: Todo[],
  isTodoComleted: boolean,
) => todos.filter(({ completed }) => completed === isTodoComleted).length;
