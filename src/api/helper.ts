import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], statusFilter: Filter) => {
  switch (statusFilter) {
    case 'All':
      return todos;

    case 'Active':
      return todos.filter(todo => !todo.completed);

    case 'Completed':
      return todos.filter(todo => todo.completed);

    default:
      throw new Error('Invalid filter type');
  }
};
