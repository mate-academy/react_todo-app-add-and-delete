import { Completed } from '../types/Completed';
import { Todo } from '../types/Todo';

export const filterTodos = (
  todos: Todo[],
  selectedFilter: Completed,
): Todo[] => {
  switch (selectedFilter) {
    case Completed.active:
      return todos.filter(todo => !todo.completed);
    case Completed.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
