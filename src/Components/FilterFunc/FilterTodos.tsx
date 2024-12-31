import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

export function filterTodos(list: Todo[], filterWord: Filter) {
  switch (filterWord) {
    case Filter.All:
      return list;
    case Filter.Active:
      return list.filter(todo => !todo.completed);
    case Filter.Completed:
      return list.filter(todo => todo.completed);
    default:
      return list;
  }
}
