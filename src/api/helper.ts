import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], statusFilter: Filter) => (
  todos.filter(todo => {
    switch (statusFilter) {
      case 'All':
        return todo;

      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

      default:
        throw new Error('Invalid filter type');
    }
  })
);
