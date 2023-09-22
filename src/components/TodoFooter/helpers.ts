import { filterBy } from '../../utils/filterBy';
import { FilterType } from '../../types/TodoStatus';
import { Todo } from '../../types/Todo';

export const getActiveTodoQuantity = (todos: Todo[]) => {
  return filterBy(todos, FilterType.Active).length;
};

export const getCompletedTodoIds = (todos: Todo[]) => {
  return filterBy(todos, FilterType.Completed).map(todo => todo.id);
};
