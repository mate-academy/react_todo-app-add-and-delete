import { SortTodoBy } from '../types';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], sortBy: string): Todo[] => {
  todos.filter(todo => {
    switch (sortBy) {
      case SortTodoBy.Completed:
        return todo.completed === true;
      case SortTodoBy.Active:
        return todo.completed === false;
      default:
        return todo;
    }
  });

  return todos;
};
