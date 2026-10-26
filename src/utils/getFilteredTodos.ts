import { Todo } from '../types/Todo';
import { FILTERS } from './constants';

export const getFilteredTodos = (todos: Todo[], filter: string): Todo[] => {
  switch (filter) {
    case FILTERS.active:
      return todos.filter(todo => !todo.completed);
    case FILTERS.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
