import { Todo, Filter } from '../types';

export function filterTotos(todosArr: Todo[], type: string) {
  switch (type) {
    case Filter.completed:
      return todosArr.filter((todo) => todo.completed);
    case Filter.active:
      return todosArr.filter((todo) => !todo.completed);
    default:
      return todosArr;
  }
}
