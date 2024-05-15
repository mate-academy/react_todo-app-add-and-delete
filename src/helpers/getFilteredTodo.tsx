import { StatusSelect, Todo } from '../types/Todo';

export const getFilteredTodos = (
  initialTodos: Todo[],
  status: StatusSelect,
) => {
  let filteredTodos = initialTodos;

  if (status === StatusSelect.Active) {
    filteredTodos = initialTodos.filter(item => !item.completed);
  } else if (status === StatusSelect.Completed) {
    filteredTodos = initialTodos.filter(item => item.completed);
  }

  return filteredTodos;
};
