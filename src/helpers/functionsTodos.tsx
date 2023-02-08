import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const filteredTodos = (todos: Todo[], filter: Filter) => (
  todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.All:
        return true;

      case Filter.Active:
        return !completed;

      case Filter.Completed:
        return completed;

      default:
        return 0;
    }
  })
);

export const activeTodosCount = (todos: Todo[]) => (
  todos.filter(todo => !todo.completed)
);
