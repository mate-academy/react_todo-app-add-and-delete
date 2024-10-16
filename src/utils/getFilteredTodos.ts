import { Filter } from '../types/FilterEnum';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filter: Filter) => {
  switch (filter) {
    case Filter.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Filter.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
