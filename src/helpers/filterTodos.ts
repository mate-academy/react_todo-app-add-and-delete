import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterStatus: string) => {
  return todos.filter(({ completed }) => {
    switch (filterStatus) {
      case 'Active':
        return !completed;
      case 'Completed':
        return completed;
      default:
        return true;
    }
  });
};
