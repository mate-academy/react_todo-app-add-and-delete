import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], filterStatus: FilterStatus) => {
  switch (filterStatus) {
    case FilterStatus.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FilterStatus.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
