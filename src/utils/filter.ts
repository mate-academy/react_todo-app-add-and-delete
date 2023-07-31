import { FilteredBy } from '../types/FilteredBy';
import { Todo } from '../types/Todo';

export function getFilteredTodos(todos: Todo[], filterBy: FilteredBy) {
  let preparedTodos = [...todos];

  if (filterBy === 'active') {
    preparedTodos = todos.filter(todo => !todo.completed);
  }

  if (filterBy === 'completed') {
    preparedTodos = todos.filter(todo => todo.completed);
  }

  return preparedTodos;
}
