import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todosFromServer: Todo[], filterBy: Status) => {
  const filteredTodos = [...todosFromServer];

  switch (filterBy) {
    case Status.Active:
      return filteredTodos.filter(todo => !todo.completed);

    case Status.Completed:
      return filteredTodos.filter(todo => todo.completed);

    default:
      return filteredTodos;
  }
};
