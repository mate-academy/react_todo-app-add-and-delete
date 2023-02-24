import { Filter } from '../enums/Filter';
import { Todo } from '../types/Todo';

export const filteredTodos = (
  todos: Todo[], filter: Filter,
) => {
  switch (filter) {
    case Filter.ALL:
      return [...todos];

    case Filter.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Filter.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return [...todos];
  }
};
