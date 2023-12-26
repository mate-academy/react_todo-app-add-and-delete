import { Todo } from './Todo';
import { Filter } from './Filter';
import { Error } from './Error';

export type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  inputValue: string;
  loadings: Todo[];
  filter: Filter;
  error: Error | '';
};
