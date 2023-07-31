import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/filterTypes';

const prepearedTodos = (
  todos: Todo[],
  filterType: string,
) => {
  const todosCopy = [...todos].filter(todo => {
    switch (filterType) {
      case FilterTypes.all:
        return todos;
      case FilterTypes.active:
        return !todo.completed;
      case FilterTypes.completed:
        return todo.completed;
      default:
        return 0;
    }
  });

  return todosCopy;
};

export const utils = {
  USER_ID: 11206,
  prepearedTodos,
};
