import { ErrorMessage } from './ErrorMessages';
import { Todo } from './Todo';

export type Context = {
  USER_ID: number;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: ErrorMessage | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | null>>;
  setErrorWithTimeout:(error: ErrorMessage,
    setError: React.Dispatch<React.SetStateAction<ErrorMessage | null>>) => void
};
