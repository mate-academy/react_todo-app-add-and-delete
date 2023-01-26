import { FilterStatus } from '../types/Filterstatus';
import { Todo } from '../types/Todo';

export const filterTodosByCompleted = (
  todos: Todo[], filterStatus: FilterStatus,
) => todos
  .filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });
