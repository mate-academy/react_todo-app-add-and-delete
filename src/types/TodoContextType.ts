import { ErrorMessage } from './ErrorMessages';
import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  status: Status;
  tempTodo: Todo | null;
  errorMessage: ErrorMessage;
  updatingTodosIds: number[];
  addTodo: (newTodo: Todo) => void;
  deleteTodo: (todoDeleteID: number) => void;
  changeStatus: (newStatus: Status) => void;
  handleSetErrorMessage: (newError: ErrorMessage) => void;
  handleSetTempTodo: (newTodo: Todo | null) => void;
  handleUpdatingTodosIds: (id: number | null) => void;
}
