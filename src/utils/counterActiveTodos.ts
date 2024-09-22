import { Todo } from '../types/Todo';

export function counterActiveTodos(todos: Todo[]) {
  return todos.filter(todo => !todo.completed).length;
}
