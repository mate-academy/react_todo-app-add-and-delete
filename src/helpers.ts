import { Progress } from './types/Progress';
import { Todo } from './types/Todo';

export const getItemsLeft = (arr: Todo[]) => {
  return arr.filter(item => item.completed === false).length;
};

export const filterTodos = (todos: Todo[], progress: Progress) => {
  return todos.filter(todo => {
    switch (progress) {
      case Progress.Active:
        return !todo.completed;

      case Progress.Completed:
        return todo.completed;

      default:
        return todos;
    }
  });
};
