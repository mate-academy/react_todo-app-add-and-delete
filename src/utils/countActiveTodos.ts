import { Todo } from '../types/Todo';

export const countActiveTodos = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed).length;
};
