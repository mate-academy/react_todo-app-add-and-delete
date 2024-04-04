import { Todo } from '../types/Todo';
import { ErrorTypes, FilterTypes } from '../types/enums';

export function prepareVisibleTodos(todos: Todo[], filterBy: FilterTypes) {
  let visibleTodos: Todo[] = [...todos];

  if (filterBy !== FilterTypes.All) {
    visibleTodos = visibleTodos.filter(item => {
      switch (filterBy) {
        case FilterTypes.Active:
          return !item.completed;
        case FilterTypes.Completed:
          return item.completed;
        default:
          return item;
      }
    });
  }

  return visibleTodos;
}

export const handleError = (
  message: ErrorTypes,
  setErrorMessage: (message: ErrorTypes) => void,
) => {
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(ErrorTypes.def), 3000);
};

export const itemsLeft = (todos: Todo[]) => {
  return todos.filter(item => !item.completed).length;
};
