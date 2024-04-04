import { FILTERS } from '../types/Filters';
import { Todo } from '../types/Todo';

export function getfilteredTodos(todos: Todo[], filter: string) {
  let preperedTodos = [...todos];

  switch (filter) {
    case FILTERS.active:
      preperedTodos = preperedTodos.filter(todo => !todo.completed);
      break;
    case FILTERS.completed:
      preperedTodos = preperedTodos.filter(todo => todo.completed);
  }

  return preperedTodos;
}
