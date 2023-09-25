import { Todo } from '../types';

export const pickCompletedTodos = (
  todoItems: Todo[],
) => todoItems.filter(({ completed }) => completed === true);
