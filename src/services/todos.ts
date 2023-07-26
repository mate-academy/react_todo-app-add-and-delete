import { FilterBy, Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filterBy: FilterBy): Todo[] {
  switch (filterBy) {
    case FilterBy.COMPLETED:
      return todos.filter(todo => todo.completed);
    case FilterBy.ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
}
