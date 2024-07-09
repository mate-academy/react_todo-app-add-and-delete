import { Todo } from './Todo';
import { Filter } from './Filter';

export interface FooterProps {
  todos: Todo[];
  filterBy: string;
  setFilterBy: (filterBy: Filter) => void;
  handleClearCompleted: () => void;
}
