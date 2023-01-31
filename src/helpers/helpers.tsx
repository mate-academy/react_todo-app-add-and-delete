import { Todo } from '../types/Todo';

export const getCompletedTodoIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodoIds = completedTodos.map(todo => todo.id);

  return completedTodoIds;
};
