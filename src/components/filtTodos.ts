import { Todo } from '../types/Todo';
import { FiltType } from '../types/Filter';

export function filtTodos(
  todos: Todo[],
  filtType: FiltType,
) {
  const visibleTodos = [...todos];

  switch (filtType) {
    case FiltType.Active:
      return visibleTodos.filter(todo => !todo.completed);

    case FiltType.Completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
}
