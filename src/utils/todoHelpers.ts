import { GroupStatusTypes } from '../types/status';
import { Todo } from '../types/Todo';

export function getFilteredTodos(
  todosForFilter: Todo[],
  status: GroupStatusTypes,
) {
  switch (status) {
    case GroupStatusTypes.ALL:
      return todosForFilter;

    case GroupStatusTypes.ACTIVE:
      return todosForFilter.filter(todo => !todo.completed);

    case GroupStatusTypes.COMPLETED:
      return todosForFilter.filter(todo => todo.completed);

    default:
      return todosForFilter;
  }
}
