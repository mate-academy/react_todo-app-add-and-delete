import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const getFilteredTodos = (todos: Todo[], currentFilter: Filter) => {
  let filteredTodos;

  switch (currentFilter) {
    case Filter.Completed:
      filteredTodos = todos.filter((todo: Todo) => todo.completed);
      break;
    case Filter.Active:
      filteredTodos = todos.filter((todo: Todo) => !todo.completed);
      break;
    default:
      filteredTodos = todos;
      break;
  }

  return filteredTodos;
};
