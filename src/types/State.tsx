import { Filter } from './Filter';
import { Todo } from './Todo';

export interface State {
  todos: Todo[],
  filterBy: Filter,
  errorMessage: string,
  tempTodo: Todo | null,
  isLoading: boolean,
  currentTodosId: number[],
}
