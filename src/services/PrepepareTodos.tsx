import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getPreparedTodos(
  todoList: Todo[],
  filter: Filter,
) {
  let preparedTodos = [...todoList];

  switch (filter) {
    case Filter.All:
      preparedTodos = [...todoList];
      break;

    case Filter.Active:
      preparedTodos = preparedTodos.filter(todo => !todo.completed);
      break;

    case Filter.Completed:
      preparedTodos = preparedTodos.filter(todo => todo.completed);
      break;

    default:
      preparedTodos = [...todoList];
  }

  return preparedTodos;
}
