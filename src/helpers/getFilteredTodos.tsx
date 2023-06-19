import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterBy) => {
  return todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.COMPLETED:
        return todo.completed ? todo : 0;
      case FilterBy.ACTIVE:
        return todo.completed ? 0 : todo;
      case FilterBy.ALL:
        return todo;
      default:
        return 0;
    }
  });
};
