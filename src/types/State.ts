import { Status } from './Status';
import { Todo } from './Todo';

export interface State {
  todos: Todo[];
  status: Status;
  title: string;
  editingId: number | undefined;
  loading: boolean;
  errorMessage: string;
  isSubmitting: boolean;
  tempTodo: Todo | null;
  deletedTodos: Todo[];
  resetDeletedTodos: [];
}
