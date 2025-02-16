import { Todo } from '../types/Todo';
import { TypeFilter } from '../types/TypeFilter';

export const getFilteredTodos = (todos: Todo[], filterBy: TypeFilter) => {
  const filteredTodos = [...todos];

  switch (filterBy) {
    case TypeFilter.Active:
      return filteredTodos.filter(todo => !todo.completed);
    case TypeFilter.Completed:
      return filteredTodos.filter(todo => todo.completed);
    default:
      return filteredTodos;
  }
};
