import { Todo } from '../types/Todo';

export type Filter = 'completed' | 'all' | 'active';

export const filterTodos = (todos: Todo[], filterBy: Filter): Todo[] => {
  switch (filterBy) {
    case 'completed':
      return todos.filter(v => v.completed === true);
    case 'all':
      return todos;
    case 'active':
      return todos.filter(v => v.completed === false);
    default:
      return todos;
  }
};
