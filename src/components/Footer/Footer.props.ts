import { FilterType } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

export type Props = {
  filterType: FilterType;
  handleFilterType: (type: FilterType) => void;
  todos: Todo[];
  deleteCompleted: () => void;
};
