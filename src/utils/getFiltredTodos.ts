import { Todo } from '../types/Todo';
import { FilterBy } from '../types/Filter';

export const getFiltredTodos = (todos: Todo[], filterType: FilterBy) => (
  todos.filter(todo => {
    switch (filterType) {
      case FilterBy.ACTIVE:
        return !todo.completed;

      case FilterBy.COMPLETED:
        return todo.completed;

      case FilterBy.ALL:
      default:
        return true;
    }
  })
);
