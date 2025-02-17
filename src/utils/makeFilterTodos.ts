import { Filter, Todo } from '../types';

export const makeFilterTodos = (todos: Todo[], filter: Filter): Todo[] => {
  switch (filter) {
    case Filter.active:
      return todos.filter(({ completed }) => !completed);

    case Filter.completed:
      return todos.filter(({ completed }) => completed);

    case Filter.all:
      return todos;

    default:
      // eslint-disable-next-line no-console
      console.warn('Unknown filter');

      return todos;
  }
};
