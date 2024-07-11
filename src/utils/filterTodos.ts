import { Completed } from '../types/Filters';
import { Todo } from '../types/Todo';

export const handlefilterTodos = (todos: Todo[], filtersParams: Completed) => {
  let copyTodos = [...todos];

  copyTodos = copyTodos.filter(item => {
    switch (filtersParams) {
      case Completed.Active:
        return item.completed === false;
      case Completed.Completed:
        return item.completed;
      case Completed.All:
      default:
        return true;
    }
  });

  return copyTodos;
};
