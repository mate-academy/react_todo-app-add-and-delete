import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (
  newFilter: FilterType,
  todosFromServer:Todo[],
) => {
  let todoCopy: Todo[] = [...todosFromServer];

  if (newFilter === FilterType.active) {
    todoCopy = todosFromServer.filter((todo:Todo) => !todo.completed);
  }

  if (newFilter === FilterType.completed) {
    todoCopy = todosFromServer.filter((todo:Todo) => todo.completed);
  }

  return todoCopy;
};
