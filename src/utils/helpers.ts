import { Todo } from '../types/Todo';

export const filterByStatus = (todos: Todo[], isCompleted: boolean) => {
  return todos.filter(todo => todo.completed === isCompleted);
};
