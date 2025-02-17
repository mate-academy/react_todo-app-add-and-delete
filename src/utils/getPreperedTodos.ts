import { Todo } from '../types/Todo';
import { FilterState } from '../types/FilterState';

export const getPreparedTodos = (todos: Todo[], filter: FilterState) => {
  switch (filter) {
    case FilterState.COMPLETED:
      return todos.filter(todo => todo.completed);
    case FilterState.ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
