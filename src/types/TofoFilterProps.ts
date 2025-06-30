import { Todo } from './TodoProps';
import { FilterStatus } from './FilterButtonsProps';

export interface TodoFilterProps {
  query: string;
  setQuery: (value: string) => void;
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
  isLoading?: boolean;
  isModalOpen?: boolean;
  setIsModalOpen?: (isOpen: boolean) => void;
  filteredTodos?: Todo[];
}
