import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodo = (todos: Todo[], filter: Filter): Todo[] => {
  switch (filter) {
    case Filter.All:
      return todos;
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
