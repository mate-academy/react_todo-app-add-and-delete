import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterStatus: FilterBy): Todo[] => {
  switch (filterStatus) {
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);

    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);

    default:
      return todos;
  }
};
