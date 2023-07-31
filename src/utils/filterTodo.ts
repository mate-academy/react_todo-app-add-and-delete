import { Filter, Todo } from '../types/Todo';

export function filterTodosByStatus(todos: Todo[], status: Filter) {
  let todosCopy = [...todos];

  switch (status) {
    case 'active': {
      todosCopy = todosCopy.filter(todo => !todo.completed);
      break;
    }

    case 'completed': {
      todosCopy = todosCopy.filter(todo => todo.completed);
      break;
    }

    default: {
      break;
    }
  }

  return todosCopy;
}
