import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

export const getVisibletodos = (todos: Todo[], filterBy: FilterBy): Todo[] => {
  switch (filterBy) {
    case FilterBy.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FilterBy.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
