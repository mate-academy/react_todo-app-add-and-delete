import { TodoViewModel } from '../types/Todo';

export function filterTodos(
  todos: TodoViewModel[],
  completed: boolean | null,
): TodoViewModel[] {
  if (!todos) {
    return [];
  }

  if (completed !== null) {
    return todos.filter(todo => todo.completed === completed);
  }

  return todos;
}
