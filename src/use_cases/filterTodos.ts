import { FilterState } from '../types/FilterState';
import { Todo } from '../types/Todo';

export function filterTodos(
  filterState: FilterState,
  seqrchQuery: string,
  todos: Todo[] = [],
): Todo[] {
  let resTodos = todos || [];

  if (filterState === FilterState.Active) {
    resTodos = resTodos.filter(todo => !todo.completed);
  }

  if (filterState === FilterState.Completed) {
    resTodos = resTodos.filter(todo => todo.completed);
  }

  if (seqrchQuery) {
    resTodos = resTodos?.filter(todo =>
      todo.title.toLowerCase().includes(seqrchQuery.toLowerCase()),
    );
  }

  return resTodos;
}
