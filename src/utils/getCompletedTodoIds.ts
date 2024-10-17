import { Todo } from '../types';

export function getCompletedTodoIds(todos: Todo[]) {
  return todos.reduce((ids, todo) => {
    if (todo.completed) {
      ids.push(todo.id);
    }

    return ids;
  }, [] as number[]);
}
