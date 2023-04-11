import { StatusToFilter, Todo } from '../types/Todo';

export const getFilteredTodos = (type: StatusToFilter, todos: Todo[]) => {
  return todos.filter((todo: Todo) => {
    switch (type) {
      case StatusToFilter.Active:
        return !todo.completed;

      case StatusToFilter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
};
