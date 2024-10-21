import { Todo } from '../types/Todo';

export const areAllCompleted = (todos: Todo[]) => {
  return todos.every(todo => todo.completed);
};
