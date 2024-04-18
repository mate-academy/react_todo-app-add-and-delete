import { ErrorText } from './ErrorText';
import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  status: Status;
  setStatus: (status: Status) => void;
  errMessage: ErrorText;
  setErrMessage: (text: ErrorText) => void;
  deleteTodo: (todoId: number) => void;
  addTodo: (todo: Todo) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  handleCompleted: (todo: Todo) => void;
}
