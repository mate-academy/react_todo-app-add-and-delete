import { ErrorMessages } from '../enums';
import { State } from '../types';

export const initialState: State = {
  todos: [],
  tempTodo: null,
  errorMessage: ErrorMessages.NoError,
  loader: {
    isLoading: false,
    todoIds: [],
  },
};
