import { Todo } from '../types/Todo';
import { FilterStates } from '../types/enums';

export const filterTodos = (todos: Todo[], filter: FilterStates) => {
  switch (filter) {
    case FilterStates.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FilterStates.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
