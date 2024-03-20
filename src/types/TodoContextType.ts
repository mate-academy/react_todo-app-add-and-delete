import { ErrorMessage } from './ErrorMessage';
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
  deleteTodo: (todoToDeleteID: number) => void;
  handleSetTempTodo: (newTodo: Todo | null) => void;
  handleSetErrorMessage: (newError: ErrorMessage) => void;
  handleUpdatingTodosIds: (id: number | null) => void;
  changeStatus: (newStatus: Status) => void;
}
