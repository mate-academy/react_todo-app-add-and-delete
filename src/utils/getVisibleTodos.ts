import { Todo } from '../types/Todo';
import { TodoFilters } from '../types/TodoFilters';

export const getVisibleTodos = (todos: Todo[], todoFilter: TodoFilters) => {
  let visibleTodos = [...todos];

  if (todoFilter !== TodoFilters.All) {
    switch (todoFilter) {
      case TodoFilters.Completed:
        visibleTodos = visibleTodos.filter(todo => todo.completed);
        break;
      case TodoFilters.Active:
        visibleTodos = visibleTodos.filter(todo => !todo.completed);
        break;
      default:
        break;
    }
  }

  return visibleTodos;
};
