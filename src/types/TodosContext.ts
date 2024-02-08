import { Filter } from './Filter';
import { Todo } from './Todo';

export interface TodosContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  filter: Filter;
  setFilter: (v: Filter) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  USER_ID: number;
}
