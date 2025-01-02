import { Todo } from '../types/Todo';

export const getFilteredItems = (items: Todo[], filterBy: string): Todo[] => {
  switch (filterBy) {
    case 'active':
      return items.filter(item => !item.completed);
    case 'completed':
      return items.filter(item => item.completed);
    default:
      return items;
  }
};
