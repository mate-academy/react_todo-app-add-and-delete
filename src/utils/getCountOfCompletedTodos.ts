import { Todo } from '../types/Todo';

export function getCountOfCompletedTodos(todos: Todo[]): number {
  const countOfActiveTodos = todos.reduce((acc, todo) => {
    if (todo.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return countOfActiveTodos;
}
