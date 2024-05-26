import { Errors } from '../types/Errors';
import { FilterBy } from '../types/FiilterBy';
import { Todo } from '../types/Todo';

type FilterTheTodos = (todos: Todo[], filterBy: FilterBy) => Todo[];

export const getFilteredTodos: FilterTheTodos = (todos, filterBy) => {
  if (filterBy !== FilterBy.All) {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          throw new Error(Errors.Unknown);
      }
    });
  }

  return todos;
};
