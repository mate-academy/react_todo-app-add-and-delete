import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterBy) => (
  todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.completed:
        return todo.completed;

      case FilterBy.active:
        return !todo.completed;

      case FilterBy.all:
        return true;

      default:
        return false;
    }
  })
);
