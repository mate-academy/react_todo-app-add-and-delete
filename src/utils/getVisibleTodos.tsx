import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function getVisibleTodos(todos: Todo[], filter: string) {
  let newTodosList = [...todos];

  if (filter) {
    switch (filter) {
      case FilterType.Active:
        newTodosList = newTodosList.filter(todo => !todo.completed);
        break;
      case FilterType.Completed:
        newTodosList = newTodosList.filter(todo => todo.completed);
        break;
      case FilterType.All:
      default:
        break;
    }
  }

  return newTodosList;
}
