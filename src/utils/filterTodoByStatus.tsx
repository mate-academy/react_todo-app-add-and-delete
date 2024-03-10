import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const filterByTodoStatus = (
  todoItems: Todo[],
  filterStatus: Status,
) => {
  switch (filterStatus) {
    case Status.Active:
      return todoItems.filter((todo: Todo) => !todo.completed);
    case Status.Completed:
      return todoItems.filter((todo: Todo) => todo.completed);
    default:
      return todoItems;
  }
};
