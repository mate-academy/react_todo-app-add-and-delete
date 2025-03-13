import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterStatus) => {
  const filteredTodos = [...todos];

  switch (filterBy) {
    case FilterStatus.Active:
      return filteredTodos.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return filteredTodos.filter(todo => todo.completed);
    default:
      return filteredTodos;
  }
};