import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const prepareTodos = (
  todosList: Todo[],
  selectedFilter: Filter,
): Todo[] => {
  let filteredTodos;

  switch (selectedFilter) {
    case Filter.Active:
      filteredTodos = todosList.filter(todo => !todo.completed);
      break;

    case Filter.Completed:
      filteredTodos = todosList.filter(todo => todo.completed);
      break;
    default:
      filteredTodos = [...todosList];
      break;
  }

  return filteredTodos;
};
