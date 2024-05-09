import { Todo } from '../types/Todo';
import { CompletedStatus } from '../types/CompletedStatus';

export const getPreparedTodos = (
  todos: Todo[],
  { filterByStatus }: { filterByStatus: CompletedStatus },
) => {
  let preparedTodos;

  switch (filterByStatus) {
    case CompletedStatus.Active:
      preparedTodos = todos.filter(todo => !todo.completed);
      break;

    case CompletedStatus.Completed:
      preparedTodos = todos.filter(todo => todo.completed);
      break;

    default:
      preparedTodos = todos;
  }

  return preparedTodos;
};
