import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], status: string) => {
  let preparedTodos = [...todos];

  preparedTodos = preparedTodos.filter(todo => {
    switch (status) {
      case Status.All:
        return true;
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        throw new Error('Filter type is incorrect');
    }
  });

  return preparedTodos;
};
