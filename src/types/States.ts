import { Filter } from './Filter';
import { Todo } from './Todo';

export interface States {
  todos: Todo[];
  errorMessage: string | null;
  isUpdating: boolean;
  selectedTodo: number | null;
  filter: Filter;
  tempTodo: Todo | null;
}
