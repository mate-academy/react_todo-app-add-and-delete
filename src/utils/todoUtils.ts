import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/types';

export const getVisibleTodos = (todos: Todo[], filter: FilterStatus) => {
  switch (filter) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
