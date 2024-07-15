import { Todo } from '../types/Todo/Todo';

export const getActiveTodos = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed);
};
