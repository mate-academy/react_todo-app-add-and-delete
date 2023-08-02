import { Todo, Filter } from '../types/todo';

export function filterTodos(filter: Filter, todos: Todo[]) {
  switch (filter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);

    case Filter.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}
