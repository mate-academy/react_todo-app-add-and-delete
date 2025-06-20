import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';

export const filteringTodos = (todos: Todo[], filter: TodoFilter) => {
  const filteredTodos = [...todos];

  switch (filter) {
    case TodoFilter.ACTIVE:
      return filteredTodos.filter(todo => !todo.completed);
    case TodoFilter.COMPLETED:
      return filteredTodos.filter(todo => todo.completed);
    default:
      return filteredTodos;
  }
};
