import { Todo, FilterTypes } from '../types';

export function filterTotos(todosArr: Todo[], type: string) {
  switch (type) {
    case FilterTypes.Completed:
      return todosArr.filter((todo) => todo.completed);
    case FilterTypes.Active:
      return todosArr.filter((todo) => !todo.completed);
    default:
      return todosArr;
  }
}
