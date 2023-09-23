import { Filters } from '../../types/Filters';
import { TodoType } from '../../types/Todo';

export type TodosContextType = {
  todos: TodoType[];
  loadingTodos: boolean;
  handleFilter: (filter: Filters) => void;
  filteredTodos: TodoType[],
  filter: Filters,
  // handleChecked: (todo: TodoType) => void;
};
