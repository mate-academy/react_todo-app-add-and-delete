import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodoList(listOfTodos: Todo[], filterBy: Status) {
  return listOfTodos.filter(todo => {
    switch (filterBy) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
}
