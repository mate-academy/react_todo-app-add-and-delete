import { FilterTodos } from '../types/FilterTodos';
import { Todo } from '../types/Todo';

export function handleFilteredTodos(
  todos: Todo[],
  filterSelected: FilterTodos,
) {
  const filteredTodos = [...todos];

  switch (filterSelected) {
    case FilterTodos.active:
      return filteredTodos.filter(todo => !todo.completed);
    case FilterTodos.completed:
      return filteredTodos.filter(todo => todo.completed);
    default:
      return filteredTodos;
  }
}
