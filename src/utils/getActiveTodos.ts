import { Todo } from '../types/Todo';

export const getActiveTodos = (allTodos: Todo[]) => (
  allTodos.filter(todo => !todo.completed)
);
