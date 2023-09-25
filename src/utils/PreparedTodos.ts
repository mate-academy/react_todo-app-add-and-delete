import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/TodoFilter';

export const getpreparedTodos = (todos: Todo[], filter: TodosFilter) => {
  return todos.filter((todo: Todo) => {
    switch (filter) {
      case TodosFilter.Active:
        return !todo.completed;
      case TodosFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
