import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function prepareTodos(field: FilterType, todos: Todo[]): Todo[] {
  let visibleTodos = [...todos];

  switch (field) {
    case (FilterType.ALL):
      break;

    case (FilterType.ACTIVE):
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case (FilterType.COMPLETED):
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    default:
      throw new Error('Sorry, but data not loaded');
  }

  return visibleTodos;
}
