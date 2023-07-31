import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], filter: Filter) => {
  const preparedTodos = [...todos];

  switch (filter) {
    case Filter.All:
    default:
      return preparedTodos;

    case Filter.Active:
      return preparedTodos.filter(todo => todo.completed === false);

    case Filter.Completed:
      return preparedTodos.filter(todo => todo.completed === true);
  }
};
