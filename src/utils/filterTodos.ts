import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const filterTodos = (filterStatus: Status, todoList: Todo[]): Todo[] => {
  switch (filterStatus) {
    case Status.Active:
      return todoList.filter(todo => !todo.completed);

    case Status.Completed:
      return todoList.filter(todo => todo.completed);

    default:
      return todoList;
  }
};
