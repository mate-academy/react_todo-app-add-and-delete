import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterType: Filter) => {
  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ALL:
      default:
        return true;
    }
  });

  return filteredTodos;
};
