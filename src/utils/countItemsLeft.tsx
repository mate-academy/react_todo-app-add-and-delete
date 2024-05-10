import { Todo } from '../types/Todo';

export const countItemsLeft = (todos: Todo[]): number => {
  const items = todos.filter(item => !item.completed);

  return items.length;
};
