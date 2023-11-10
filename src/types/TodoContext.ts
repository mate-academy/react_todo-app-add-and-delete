import { Todo } from './Todo';
import { TodoFilter } from '../enums/TodoFilter';
import { TodoError } from '../enums/TodoError';

export type TodoContextType = {
  todos: Todo[];
  filteredTodos: Todo[];
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void;

  filter: TodoFilter;
  setFilter: (newfilter: TodoFilter) => void;

  error: TodoError;
  setError: (newError: TodoError) => void;

  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};
