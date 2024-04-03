import { SortField } from '../../types/SortField';
import { Todo } from '../../types/Todo';

export const filterTodos = (todos: Todo[], filter: SortField) => {
  return todos.filter(todo => {
    switch (filter) {
      case SortField.Active:
        return !todo.completed;
      case SortField.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
