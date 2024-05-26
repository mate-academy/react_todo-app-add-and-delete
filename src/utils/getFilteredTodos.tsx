import { FilterField } from '../types/FilterField';
import { Todo } from '../types/Todo';

export function getFilteredTodos(filterField: FilterField, todos: Todo[]) {
  switch (filterField) {
    case FilterField.Active:
      return todos.filter(todo => !todo.completed);
    case FilterField.Completed:
      return todos.filter(todo => todo.completed);
    case FilterField.All:
      return [...todos];
  }
}
