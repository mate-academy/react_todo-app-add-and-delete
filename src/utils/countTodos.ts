import { Todo } from '../types/Todo';

export function countTodos(todos: Todo[], isCompleted: boolean) {
  return todos.filter(({ completed }) => completed === isCompleted).length;
}
