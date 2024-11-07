import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/filterTypes';

export const getFilteredTodos = (todos: Todo[], flter: FilterTypes): Todo[] => {
  switch (flter) {
    case FilterTypes.Active:
      return todos.filter(todo => !todo.completed);
    case FilterTypes.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
