import { Todo } from './Todo';
import { ErrorType } from './ErrorType';

export type GlobalState = {
  userId: number,
  todos: Todo[],
  tempTodo: Todo | null,
  error: ErrorType | null,
};
