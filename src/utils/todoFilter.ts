import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export function getPreparedTodos(todoList: Todo[], filterType: Filter): Todo[] {
  const preparedTodos = [...todoList];

  switch (filterType) {
    case Filter.All:
      return preparedTodos;
    case Filter.Completed:
      return preparedTodos.filter(todo => todo.completed);
    case Filter.Active:
      return preparedTodos.filter(todo => !todo.completed);
    default:
      return todoList;
  }
}
