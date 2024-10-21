import { Todo } from '../types/Todo';

export const areAllActive = (todos: Todo[]) => {
  return todos.every(todo => !todo.completed);
};
