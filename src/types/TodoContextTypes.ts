
import { Todo } from "./Todo";
import { Status } from "./Status";
import { ErrText } from "./ErrText";

export interface TodoContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  status: Status;
  setStatus: (status: Status) => void;
  errMessage: ErrText;
  setErrMessage: (text: ErrText) => void;
  deleteTodo: (todoId: number) => void;
  addTodo: (todo: Todo) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  handleCompleted: (todo: Todo) => void;
}
