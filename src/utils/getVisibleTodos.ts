import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const getVisibleTodos = (todos: Todo[], status: TodoStatus) => {
  const visibleTodos = [...todos];

  switch (status) {
    case TodoStatus.Active:
      return visibleTodos.filter(todo => !todo.completed);
    case TodoStatus.Completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
};
