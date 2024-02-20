import { ErrorsMessage } from './ErrorsMessage';
import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextTypes {
  todos: Todo[];
  filteredTodos: Todo[];
  status: Status;
  tempTodo: Todo | null;
  errorMessage: ErrorsMessage;
  updatingTodosIds: number[];
  addTodo: (newTodo: Todo) => void;
  deleteTodo: (todoDeleteID: number) => void;
  handleSetTempTodo: (newTodo: Todo | null) => void;
  handleSetErrorMessage: (newError: ErrorsMessage) => void;
  handleUpdatingTodosIds: (id: number | null) => void;
  changeStatus: (newStatus: Status) => void;
}
