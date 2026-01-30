import { FilterState } from './App';
import { Todo } from './types/Todo';

export function filterTodos(filterState: FilterState, todos: Todo[]): Todo[] {
  if (filterState === FilterState.Active) {
    return todos.filter(todo => !todo.completed);
  }

  if (filterState === FilterState.Completed) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
}
