import { Todo } from '../types/Todo';
import { Options } from '../types/Options';

export const getFilteredTodos = (
  todos: Todo[],
  filterType: Options,
): Todo[] => {
  switch (filterType) {
    case Options.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Options.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
