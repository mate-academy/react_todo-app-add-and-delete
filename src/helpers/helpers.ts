import { FilterType } from '../enum/filterTypes';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filter: FilterType) => {
  const { Active, Completed } = FilterType;

  switch (filter) {
    case Active:
      return todos.filter((todo: Todo) => !todo.completed);
    case Completed:
      return todos.filter((todo: Todo) => todo.completed);
    default:
      return todos;
  }
};
