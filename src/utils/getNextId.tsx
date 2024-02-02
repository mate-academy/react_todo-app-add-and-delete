import { Todo } from '../types/Todo';

export const getNextId = (todos: Todo[]) => {
  const ids = todos.map((todo) => todo.id);

  return Math.max(...ids) + 1;
};
