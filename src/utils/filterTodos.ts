import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const filterTodos = (todos: Todo[], filter: Filter): Todo[] => {
  if (filter === Filter.Active) {
    return todos.filter(todo => !todo.completed);
  }

  if (filter === Filter.Completed) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};
