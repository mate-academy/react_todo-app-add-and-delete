import { Statuses } from '../types/Statuses';
import { Todo } from '../types/Todo';

interface Filter {
  status: Statuses;
}

export const getFilteredTodos = (todos: Todo[], { status }: Filter): Todo[] => {
  if (status === Statuses.All) {
    return todos;
  }

  return todos.filter(todo =>
    status === Statuses.Completed ? todo.completed : !todo.completed,
  );
};
