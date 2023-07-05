import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const getFiltredTodos = (
  todos: Todo[],
  filterBy: FilterBy,
) => {
  const { COMPLITED, ACTIVE, ALL } = FilterBy;

  return todos.filter(todo => {
    switch (filterBy) {
      case COMPLITED:
        return todo.completed
          ? todo
          : false;

      case ACTIVE:
        return todo.completed
          ? false
          : todo;

      case ALL:
        return todo;

      default:
        return false;
    }
  });
};
