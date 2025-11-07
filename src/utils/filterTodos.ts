import { Todo } from '../types/Todo';
import { TodoStatusFilter } from '../types/TodoStatusFilter';

export const getFilteredTodos = (todos: Todo[], status: TodoStatusFilter) => {
  let filteredTodos = [...todos];

  if (status === TodoStatusFilter.ALL) {
    return filteredTodos;
  }

  filteredTodos = filteredTodos.filter(todo => {
    if (status === TodoStatusFilter.COMPLETED) {
      return todo.completed;
    }

    return !todo.completed;
  });

  return filteredTodos;
};
