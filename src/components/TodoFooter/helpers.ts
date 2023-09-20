import { getTodos } from '../../api/todos';
import { filterBy } from '../../utils/filterBy';
import { FilterType } from '../../types/TodoStatus';
import { USER_ID } from '../../utils/constants';

export const getActiveTodoQuantity = () => {
  let quantity = 0;

  getTodos(USER_ID).then(todos => {
    quantity = filterBy(todos, FilterType.Active).length;
  });

  return quantity;
};
