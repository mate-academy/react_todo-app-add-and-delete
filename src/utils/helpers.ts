import { Todo } from '../types/Todo';
import { TaskStatus } from '../types/Sort';

export const getFilteredTodos = (todos: Todo[], sortType: TaskStatus) => {
  return todos.filter(todo => {
    switch (sortType) {
      case TaskStatus.ACTIVE:
        return !todo.completed;

      case TaskStatus.COMPLETED:
        return todo.completed;

      default:
        return todos;
    }
  });
};
