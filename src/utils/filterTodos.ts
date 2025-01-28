import { Todo } from '../types/Todo';
import { FilterStatusEnum } from '../types/Status.enum';

export const filterTodos = (todos: Todo[], status: FilterStatusEnum) => {
  switch (status) {
    case FilterStatusEnum.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatusEnum.Completed:
      return todos.filter(todo => todo.completed);
    case FilterStatusEnum.All:
    default:
      return todos;
  }
};
