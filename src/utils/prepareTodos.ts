import { Todo } from '../types/Todo';
import { FilterField } from '../types/FilterField';

export function prepareTodos(field: FilterField, todos: Todo[]): Todo[] {
  let visibleTodos = [...todos];

  switch (field) {
    case (FilterField.ALL):
      break;

    case (FilterField.ACTIVE):
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case (FilterField.COMPLETED):
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    default:
      throw new Error('Sorry, but data not loaded');
  }

  return visibleTodos;
}
