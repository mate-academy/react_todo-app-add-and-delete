import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';

export const filterTodos = (
  todos: Todo[],
  selectedFilter: TodoFilter,
) => {
  let tempTodos = [...todos];

  switch (selectedFilter) {
    case TodoFilter.All:
      break;
    case TodoFilter.Active:
      tempTodos = tempTodos.filter(todo => !todo.completed);
      break;
    case TodoFilter.Completed:
      tempTodos = tempTodos.filter(todo => todo.completed);
      break;
    default: throw new Error('Unknow filter type');
  }

  return tempTodos;
};
