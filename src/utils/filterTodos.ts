import { Filters } from '../types/Filtres';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterStatus: Filters): Todo[] => {
  switch (filterStatus) {
    case Filters.Active:
      return todos.filter(todo => !todo.completed);
    case Filters.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
