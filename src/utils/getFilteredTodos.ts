import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterBy): Todo[] => {
  switch (filterBy) {
    case FilterBy.All:
      return todos;
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
