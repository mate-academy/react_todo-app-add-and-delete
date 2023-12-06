import { ErrorMessage } from '../types/ErrorMessage';
import { FilterStatus } from '../types/FilterStatus';
import { State } from '../types/State';

export const initialState: State = {
  todos: [],
  errorMessage: ErrorMessage.None,
  filteredBy: FilterStatus.All,
  tempTodo: null,
  deleteCompleted: false,
};
