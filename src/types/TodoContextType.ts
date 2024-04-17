import { Todo } from './Todo';
import { Status } from './Status';
import { Errors } from './ErrorsTodo';

export interface TodoContextType {
  todos: Todo[];
  status: Status;
  errorMessage: Errors;
  draftTodo: Todo | null;
  loading: boolean;
  modifiedTodoId: number;
  setTodos: (todos: Todo[]) => void;
  setStatus: (status: Status) => void;
  setErrorMessage: (message: Errors) => void;
  setLoading: (loading: boolean) => void;
  setDraftTodo: (todo: Todo) => void;
  addTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (todoId: number) => Promise<void>;
  handleCompleted: (currentTodo: Todo) => void;
}
