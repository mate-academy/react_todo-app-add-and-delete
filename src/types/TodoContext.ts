import { Todo } from './Todo';
import { Filter } from './Filter';
import { TodoError } from './TodoError';

export type TodoContextType = {
  todos: Todo[];
  filteredTodos: Todo[];
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void;

  filter: Filter;
  setFilter: (newfilter: Filter) => void;

  error: TodoError;
  setError: (newError: TodoError) => void;

  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};
