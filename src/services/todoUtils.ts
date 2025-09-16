import { Todo } from '../types/Todo';

export const getCompletedTodos = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed);
};
