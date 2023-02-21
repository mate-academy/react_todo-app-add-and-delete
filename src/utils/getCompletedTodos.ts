import { Todo } from '../types/Todo';

export const getCompletedTodos = (allTodos: Todo[]) => (
  allTodos.filter(todo => todo.completed)
);
