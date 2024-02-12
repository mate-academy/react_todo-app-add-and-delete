import { FilterStatus } from '../types/Status';
import { Todo } from '../types/Todo';

export const filterTodoByStatus = (
  todoItems: Todo[],
  values: FilterStatus,
) => {
  switch (values) {
    case FilterStatus.Active:
      return todoItems.filter((todo: Todo) => !todo.completed);
    case FilterStatus.Completed:
      return todoItems.filter((todo: Todo) => todo.completed);
    default:
      return todoItems;
  }
};
