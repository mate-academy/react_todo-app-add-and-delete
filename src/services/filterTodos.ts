import { FilteringBy } from '../types/FilteringBy';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filteringBy: FilteringBy) => (
  todos.filter((todo: Todo) => {
    switch (filteringBy) {
      case FilteringBy.active:
        return !todo.completed;
      case FilteringBy.completed:
        return todo.completed;
      default: return true;
    }
  })
);
