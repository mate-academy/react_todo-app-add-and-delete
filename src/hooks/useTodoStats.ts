import { Todo } from '../types/Todo';

export const useTodoStats = (todos: Todo[]) => {
  const allComplete = todos.length > 0 && todos.every(todo => todo.completed);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return { allComplete, activeCount, hasCompleted };
};
