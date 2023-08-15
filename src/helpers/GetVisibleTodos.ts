import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getVisibleTodos(todosList: Todo[], filterType: Filter): Todo[] {
  switch (filterType) {
    case Filter.Active:
      return todosList.filter(todo => !todo.completed);
    case Filter.Comleted:
      return todosList.filter(todo => todo.completed);
    default:
      return todosList;
  }
}
