import { FilterBy } from '../enums/FilterBy';
import { Todo } from '../types/Todo';

export const handleFilteredTodos = (
  todosFromServer: Todo[],
  filter: FilterBy,
) => {
  let preparedTodos = [...todosFromServer];

  if (filter === FilterBy.Active) {
    preparedTodos = preparedTodos.filter(todo => !todo.completed);
  }

  if (filter === FilterBy.Completed) {
    preparedTodos = preparedTodos.filter(todo => todo.completed);
  }

  return preparedTodos;
};
