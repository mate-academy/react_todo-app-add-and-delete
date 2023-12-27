import { ErrorMessages } from '../enums';
import { Todo } from './Todo';

export type State = {
  todos: Todo[],
  tempTodo: Todo | null,
  errorMessage: ErrorMessages;
  loader: {
    isLoading: boolean;
    todoIds: number[];
  },
};
