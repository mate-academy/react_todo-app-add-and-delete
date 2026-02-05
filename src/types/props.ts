import { Todo } from './Todo';

export interface HeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  onToggleAll?: () => void;
  isAllCompleted?: boolean;
}

export interface TodoProps {
  todo: Todo;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
  isLoading?: boolean;
}

export interface TodoListProps {
  todos: Todo[];
  loadingIds: number[];
  onDelete: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
}

export interface FilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface FooterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todosLeft: number;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
}
