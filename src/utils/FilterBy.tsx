import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function FilterBy(todosArr: Todo[], filt: string) {
  switch (filt) {
    case Filter.Active:
      return todosArr.filter(todo => !todo.completed);
      break;
    case Filter.Completed:
      return todosArr.filter(todo => todo.completed);
      break;
    case Filter.All:
    default:
      return todosArr;
  }
}
