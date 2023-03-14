import { TodoType } from '../types/TodoType';
import { Filters } from '../types/Filters';

export function filterTodos(filter: Filters, todos: TodoType[]) {
  switch (filter) {
    case Filters.All:
      return todos;

    case Filters.ACTIVE:
      return todos.filter((todo: TodoType) => !todo.completed);

    case Filters.COMPLETED:
      return todos.filter((todo: TodoType) => todo.completed);

    default:
      return todos;
  }
}
