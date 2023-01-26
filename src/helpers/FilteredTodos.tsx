import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filteredTodosHelper = (
  todos: Todo[],
  completedFilter: FilterType,
) => (
  todos.filter(todo => {
    switch (completedFilter) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        throw new Error('Invalid type');
    }
  })
);
