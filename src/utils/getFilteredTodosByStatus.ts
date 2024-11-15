import { Filter } from '../types/Filters';
import { Todo } from '../types/Todo';

export const getFilteredTodosByStatus = (todos: Todo[], filter: Filter) => {
  switch (filter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
