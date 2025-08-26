import { SORTFIELD } from '../types/SortField';
import { Todo } from '../types/Todo';

export function getVisibleTodos(items: Todo[], sortType: SORTFIELD) {
  let preparedTodos = [...items];

  if (sortType === SORTFIELD.ACTIVE) {
    preparedTodos = preparedTodos.filter(t => !t.completed);
  } else if (sortType === SORTFIELD.COMPLETED) {
    preparedTodos = preparedTodos.filter(t => t.completed);
  }

  return preparedTodos;
}

export const showError = (
  setErrorMessage: (value: string) => void,
  message: string,
) => {
  setErrorMessage('');
  setErrorMessage(message);
  setTimeout(() => {
    setErrorMessage('');
  }, 3000);
};
