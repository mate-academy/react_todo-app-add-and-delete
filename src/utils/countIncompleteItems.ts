import { Todo } from '../types/Todo';

export const countIncompleteItems = (items: Todo[]): number => {
  const incompleteItems = items.filter(todo => !todo.completed);

  return incompleteItems.length;
};
