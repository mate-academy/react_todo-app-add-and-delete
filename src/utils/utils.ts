import { Todo } from '../types/Todo';

export const getVisibleTodos = (todosFromServer: Todo[], filter: string) => {
  switch (filter) {
    case 'Active':
      return todosFromServer.filter(todo => !todo.completed);

    case 'Completed':
      return todosFromServer.filter(todo => todo.completed);

    default:
      return todosFromServer;
  }
};
