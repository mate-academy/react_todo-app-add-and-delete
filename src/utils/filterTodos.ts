import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Queries = {
  filter: FilterType;
};

export const filterTodos = (todos: Todo[], { filter }: Queries) => {
  if (filter !== 'All') {
    return todos.filter(todo => {
      switch (filter) {
        case 'Active':
          return !todo.completed;
        case 'Completed':
          return todo.completed;
      }
    });
  }

  return todos;
};
