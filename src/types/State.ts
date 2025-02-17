import { FilterStatus } from './FilterStatus';
import { Todo } from './Todo';

export interface State {
  todos: Todo[];
  filterStatus: FilterStatus;
  errorMessage: string;
  isInputFocused: boolean;
  tempTodo?: Todo | null;
  currentlyLoadingItemsIds: number[];
}
