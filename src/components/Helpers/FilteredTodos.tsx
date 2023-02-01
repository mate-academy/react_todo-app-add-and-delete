import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

export const filteredTodosFunction = (todos: Todo[], status: Filter) => {
  switch (status) {
    case Filter.Active:
      return todos.filter(todo => (
        !todo.completed));

    case Filter.Completed:
      return todos.filter(todo => (
        todo.completed));

    default:
      return todos;
  }
};
