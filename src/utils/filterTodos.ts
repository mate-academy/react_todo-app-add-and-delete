import { Filter, Todo } from '../types';

const filterFunctions = {
  [Filter.Active]: (todos: Todo[]) => todos.filter(todo => !todo.completed),
  [Filter.Completed]: (todos: Todo[]) => todos.filter(todo => todo.completed),
  [Filter.All]: (todos: Todo[]) => todos,
};

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  const filterFunction = filterFunctions[filter];

  return filterFunction(todos);
}
