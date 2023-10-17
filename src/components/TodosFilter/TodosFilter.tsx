import { Query } from '../../types/Query';
import { Todo } from '../../types/Todo';

export const getPreparedTodos = (todos: Todo[], query: Query) => {
  switch (query) {
    case 'Active': {
      return [...todos].filter(todo => todo.completed === false);
    }

    case 'Completed': {
      return [...todos].filter(todo => todo.completed === true);
    }

    default:
      return [...todos];
  }
};
