import { Todo } from '../types/Todo';

export function getSortedTodos(todos: Todo[]) {
  const completed: Todo[] = [];
  const active: Todo[] = [];

  for (const todo of todos) {
    if (todo.completed) {
      completed.push(todo);
    } else {
      active.push(todo);
    }
  }

  return {
    active: active,
    completed: completed,
  };
}
