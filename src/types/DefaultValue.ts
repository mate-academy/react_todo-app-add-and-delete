import { ErrorMessage } from './ErrorMessage';
import { Todo } from './Todo';

export interface DefaultValue {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  visibleTodos: Todo[];
  setVisibleTodos: (value: Todo[]) => void;
  tempTodo: Todo | null;
  setTempTodo: (value: Todo | null) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  error: ErrorMessage,
  setError: (value: ErrorMessage) => void,
  isClearCompleted: boolean,
  setIsClearCompleted: (value: boolean) => void,
}
