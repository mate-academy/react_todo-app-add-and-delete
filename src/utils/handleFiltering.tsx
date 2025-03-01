import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const handleFiltering = (activeFilter: Status, todosArr: Todo[]) => {
  switch (activeFilter) {
    case Status.Active:
      return todosArr.filter(filterTodo => !filterTodo.completed);
    case Status.Completed:
      return todosArr.filter(filterTodo => filterTodo.completed);
    default:
      return todosArr;
  }
};
