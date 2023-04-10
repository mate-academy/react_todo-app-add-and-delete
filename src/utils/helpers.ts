import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const filterTodos = (
  todos: Todo[],
  status: string,
): Todo[] => {
  let visibleTodos = [...todos];

  switch (status) {
    case TodoStatus.ACTIVE:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;
    case TodoStatus.COMPLETED:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;
    case TodoStatus.ALL:
    default:
      break;
  }

  return visibleTodos;
};
