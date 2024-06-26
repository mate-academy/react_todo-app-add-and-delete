import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

export const FilteredTodos = (todos: Todo[], status: TodoStatus): Todo[] => {
  let filteredTodos = [...todos];

  if (status) {
    switch (status) {
      case TodoStatus.active:
        return (filteredTodos = filteredTodos.filter(todo => !todo.completed));

      case TodoStatus.completed:
        return (filteredTodos = filteredTodos.filter(todo => todo.completed));

      case TodoStatus.all:
      default:
        break;
    }
  }

  return filteredTodos;
};
