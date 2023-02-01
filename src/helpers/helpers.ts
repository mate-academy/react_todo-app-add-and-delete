import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterStatus: string) => {
  return todos.filter(todo => {
    switch (filterStatus) {
      case 'Completed':
        return todo.completed;

      case 'Active':
        return !todo.completed;

      default:
        return true;
    }
  });
};
