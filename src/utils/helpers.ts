import { Errors } from '../types/Errors';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterType: FilterType) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};

export const unsetError = (
  setterFunc: (error: Errors | null) => void,
  errorType: Errors | null,
  delay: number,
) => {
  if (delay === undefined) {
    setterFunc(errorType);

    return;
  }

  setTimeout(() => {
    setterFunc(null);
  }, delay);
};
