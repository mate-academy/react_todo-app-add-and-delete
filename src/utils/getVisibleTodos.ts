import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getVisibleTodos(todos: Todo[], filter: Filter) {
  let visibleTodos = [...todos];

  switch (filter) {
    case Filter.Active:
      return (visibleTodos = visibleTodos.filter(todo => !todo.completed));
    case Filter.Completed:
      return (visibleTodos = visibleTodos.filter(todo => todo.completed));
    default:
      return visibleTodos;
  }
}
