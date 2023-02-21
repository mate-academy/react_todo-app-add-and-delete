import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: FilterBy) => {
  let copy = [...todos];

  copy = copy.filter(todo => {
    switch (filterBy) {
      case FilterBy.active:
        return !todo.completed;
      case FilterBy.completed:
        return todo.completed;
      case FilterBy.all:
        return copy;
      default:
        return '';
    }
  });

  return copy;
};
