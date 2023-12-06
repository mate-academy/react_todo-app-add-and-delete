import { ErrorMessage } from './ErrorMessage';
import { FilterStatus } from './FilterStatus';
import { Todo } from './Todo';

export interface State {
  todos: Todo[],
  errorMessage: ErrorMessage,
  filteredBy: FilterStatus,
  tempTodo: Todo | null,
  deleteCompleted: boolean
}
