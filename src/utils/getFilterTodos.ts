import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function getFilterTodos(todos: Todo[], filterField: Status) {
  const filterTodos = todos.filter(todo => {
    switch (filterField) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return filterTodos;
}
