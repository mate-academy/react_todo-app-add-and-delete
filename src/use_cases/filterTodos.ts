import { FilterState } from '../enums/FilterState';
import { Todo } from '../types/Todo';

export function filterTodos(filterState: FilterState, todos: Todo[] = []) {
  const filterByState = {
    [FilterState.All]: () => true,
    [FilterState.Completed]: (todo: Todo) => todo.completed,
    [FilterState.Active]: (todo: Todo) => !todo.completed,
  };

  return todos.filter(filterByState[filterState]);
}
