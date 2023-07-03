import { Todo } from '../types/Todo';

export const getCompletedTodos = (todos: Todo[]) => (
  todos.filter(todo => todo.completed)
);
