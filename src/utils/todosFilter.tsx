import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const todosFilter = (filterType: FilterType, todos: Todo[]) => {
  const todoCopy = todos;

  switch (filterType) {
    case FilterType.Active:
      return todoCopy.filter((todo) => !todo.completed);
    case FilterType.Completed:
      return todoCopy.filter((todo) => todo.completed);
    default: return todoCopy;
  }
};
