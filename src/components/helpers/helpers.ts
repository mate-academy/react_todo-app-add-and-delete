import { Todo } from '../../types/Todo';

export const getCompletedTodoIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return completedTodos.map(todo => todo.id);
};
