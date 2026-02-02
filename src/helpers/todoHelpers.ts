import { FilterStatus } from '../types/enums';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], filterStatus: FilterStatus) => {
  switch (filterStatus) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);

    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);

    case FilterStatus.All:
    default:
      return todos;
  }
};
