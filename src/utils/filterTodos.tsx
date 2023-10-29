import { Status } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], fitlerParam: Status) => {
  switch (fitlerParam) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
