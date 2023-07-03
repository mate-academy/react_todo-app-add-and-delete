import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';

export const getFilteredTodos = (
  todos: Todo[],
  status: TodoStatusFilter,
): Todo[] => {
  let todoFilterStatus = true;

  return todos.filter(todo => {
    switch (status) {
      case TodoStatusFilter.Active:
        todoFilterStatus = !todo.completed;
        break;

      case TodoStatusFilter.Completed:
        todoFilterStatus = todo.completed;
        break;

      default:
        todoFilterStatus = true;
        break;
    }

    return todoFilterStatus;
  });
};
