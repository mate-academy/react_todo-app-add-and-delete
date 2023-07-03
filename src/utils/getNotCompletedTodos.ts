import { Todo } from '../types/Todo';

export const getNotCompletedTodos = (todos: Todo[]) => (
  todos.filter(todo => !todo.completed).length
);
