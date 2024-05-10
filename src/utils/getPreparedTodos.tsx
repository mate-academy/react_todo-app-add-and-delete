import { Todo } from '../types/Todo';
import { CompletionStatus } from '../types/CompletionStatus';

export const getPreparedTodos = (
  todos: Todo[],
  { filterByStatus }: { filterByStatus: CompletionStatus },
) => {
  let preparedTodos;

  switch (filterByStatus) {
    case CompletionStatus.Active:
      preparedTodos = todos.filter(todo => !todo.completed);
      break;

    case CompletionStatus.Completed:
      preparedTodos = todos.filter(todo => todo.completed);
      break;

    default:
      preparedTodos = todos;
  }

  return preparedTodos;
};
