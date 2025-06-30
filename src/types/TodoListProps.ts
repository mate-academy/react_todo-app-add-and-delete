import { Todo } from '../types/TodoProps';
import { FilterStatus } from '../types/FilterButtonsProps';

export type TodoListProps = {
  todos: Todo[];
  isLoading: boolean;
  selectedTodoId: number | null;
  handleToggleStatus: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo?: Todo | null;
  isAdding?: boolean;
  filterStatus: FilterStatus;
};
