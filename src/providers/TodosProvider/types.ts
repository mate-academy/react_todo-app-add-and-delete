import { Filters } from '../../types/Filters';
import { TodoType } from '../../types/Todo';

export type TodosContextType = {
  todos: TodoType[];
  loadingTodos: boolean;
  handleFilter: (filter: Filters) => void;
  filteredTodos: TodoType[],
  filter: Filters,
  handleTodoDel: (todo: TodoType) => void;
  // handleChecked: (todo: TodoType) => void;
};
