import { Todo } from '../types/Todo';
import { Filter } from '../types/filter';

export const getVisibleTodos = (todos: Todo[], filterBy: Filter): Todo[] => (
  todos.filter(todo => {
    switch (filterBy) {
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ACTIVE:
        return !todo.completed;
      default:
        return todo;
    }
  })
);
