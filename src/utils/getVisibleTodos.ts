import { FilterStatusType } from '../types/FilterStatusType';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todoList: Todo[], filter: FilterStatusType) => {
  switch (filter) {
    case FilterStatusType.Active:
      return todoList.filter(todo => !todo.completed);
    case FilterStatusType.Completed:
      return todoList.filter(todo => todo.completed);
    default:
      break;
  }

  return todoList;
};
