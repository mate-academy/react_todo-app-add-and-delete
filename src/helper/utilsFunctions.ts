import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export function filterTodos(initTodos: Todo[], filterType: FilterTypes) {
  switch (filterType) {
    case FilterTypes.Active:
      return initTodos.filter(todo => !todo.completed);
    case FilterTypes.Completed:
      return initTodos.filter(todo => todo.completed);
    default:
      return initTodos;
  }
}
