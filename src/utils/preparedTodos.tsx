import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export function getPreparedTodos(todos: Todo[], filterBy: Filter) {
  const preparedTodos: Todo[] = [...todos];

  if (filterBy === Filter.Active) {
    return todos.filter(todo => !todo.completed);
  }

  if (filterBy === Filter.Completed) {
    return todos.filter(todo => todo.completed);
  }

  return preparedTodos;
}
