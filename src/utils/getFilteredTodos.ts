import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterBy: TodoStatus) => {
  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      case TodoStatus.All:
      default:
        return todo;
    }
  });

  return filteredTodos;
};
