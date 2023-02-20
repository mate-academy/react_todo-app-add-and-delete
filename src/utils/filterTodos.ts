import { FilterTypes } from '../types/FIlterTypes';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterType: FilterTypes) => {
  let filteredTodos = todos;

  switch (filterType) {
    case FilterTypes.ACTIVE:
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;

    case FilterTypes.COMPLETED:
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;

    case FilterTypes.ALL:
      filteredTodos = todos;
      break;

    default:
      throw new Error('Unexpected filter type');
  }

  return filteredTodos;
};
