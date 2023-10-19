import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/TodosFilter';

export const getFilteredTodos = (todos: Todo[], filter: TodosFilter) => {
  switch (filter) {
    case TodosFilter.Active:
      return todos.filter(({ completed }) => !completed);

    case TodosFilter.Completed:
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};
