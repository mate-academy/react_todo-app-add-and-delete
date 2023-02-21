import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterBy) => {
  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.ACTIVE:
        return !todo.completed;
      case FilterBy.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  return filteredTodos;
};
