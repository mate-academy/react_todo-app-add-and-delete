import { Errors } from '../types/Errors';
import { SortType } from '../types/SortType';
import { Todo } from '../types/Todo';

export const USER_ID = 103;

export function filterTodoList(todos: Todo[], sortKey: SortType) {
  switch (sortKey) {
    case SortType.Completed:
      return todos.filter(todo => todo.completed);

    case SortType.Active:
      return todos.filter(todo => !todo.completed);

    default:
      return todos;
  }
}

// this function should be insert into finally block to autoclose errorNotification
export function errorNotification(fn: (str: Errors | '') => void) {
  const timerid = setTimeout(() => {
    fn('');
  }, 3000);

  return () => clearTimeout(timerid);
}
