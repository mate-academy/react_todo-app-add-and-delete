import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterStatus: Filter) => {
  return todos.filter(todo => {
    const matchesStatus =
      filterStatus === Filter.All ||
      (filterStatus === Filter.Active && !todo.completed) ||
      (filterStatus === Filter.Completed && todo.completed);

    return matchesStatus;
  });
};
