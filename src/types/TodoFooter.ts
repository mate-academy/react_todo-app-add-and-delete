import { Todo } from './Todo';

export interface TodoFooterProps {
  uncompletedCount: number;
  handleClearCompleted: () => void;
  allTodosAreActive: boolean;
  todos: Todo[];
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
}

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
