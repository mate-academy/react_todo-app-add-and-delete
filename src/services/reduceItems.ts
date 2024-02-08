import { Todo } from '../types/Todo';

export function reduceItems(todos: Todo[], value: boolean) {
  const itemsCount = todos.reduce((left: number, todo: Todo) => {
    let result = left;

    if (todo.completed === value) {
      result += 1;
    }

    return result;
  }, 0);

  return itemsCount;
}
