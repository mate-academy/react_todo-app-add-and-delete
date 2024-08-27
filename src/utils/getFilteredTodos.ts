import { Todo } from '../types/Todo';
import { FilterState } from '../types/FilterState';

export const getFilteredTodos = (todos: Todo[], filter: FilterState) => {
  switch (filter) {
    case FilterState.Completed:
      return todos.filter(todo => todo.completed);
    case FilterState.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
