import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export function getVisibleTodos(todos: Todo[], query: FilterBy) {
  return [...todos].filter(todo => {
    switch (query) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      case 'all':
      default:
        return todo;
    }
  });
}
