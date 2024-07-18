import { Filter } from './Filter';
import { Todo } from './Todo';

export interface States {
  todos: Todo[];
  isLoading: boolean;
  errorMessage: string | null;
  isUpdating: boolean;
  selectedTodo: number | null;
  filter: Filter;
}
