import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

export type Props = {
  todos: Todo[]
  setFilterBy: (value: FilterStatus) => void,
  filterBy: FilterStatus,
};
