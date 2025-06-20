import { Todo } from '../types/Todo';

export const countItemsLeft = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed).length;
};
