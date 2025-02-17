import { Error } from './Error';
import { Filter } from './Filter';
import { Todo } from './Todo';

export interface State {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: Filter;
  errors: Error[];
  targetTodo: number;
  inputDisabled: boolean;
  todoDeleteDisabled: {
    value: boolean;
    targetId: number;
  };
  targetDeleteDisabled: number;
  tempTodo: {
    id: number;
    title: string;
  } | null;
}
