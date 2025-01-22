import { FilterNav } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFiltredTodos = (todos: Todo[], filter: FilterNav) => {
  return todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });
};
