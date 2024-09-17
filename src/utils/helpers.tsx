import { StatusFilterValue, Todo } from '../types/Todo';

export const getPreparedTodos = (
  todoses: Todo[],
  filterValue: StatusFilterValue,
): Todo[] => {
  let result;

  switch (filterValue) {
    case StatusFilterValue.Active:
      result = todoses.filter(todo => !todo.completed);
      break;
    case StatusFilterValue.Complited:
      result = todoses.filter(todo => todo.completed);
      break;
    default:
      result = todoses;
  }

  return result;
};
