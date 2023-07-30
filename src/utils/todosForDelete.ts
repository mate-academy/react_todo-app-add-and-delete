import { Todo } from '../types/Todo';

export function todosForDelete(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}
