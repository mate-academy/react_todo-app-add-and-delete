import { ErrorType } from './ErrorType';
import { Status } from './Status';
import { Todo } from './Todo';

export interface Context {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  tempTodo: Todo | null;
  setTempTodo: (v: Todo) => void;
  addTodo: (v: Omit<Todo, 'id'>) => Promise<void>;
  deleteTodo: (todoId: number) => void;
  filter: Status;
  setFilter: (filterBy: Status) => void;
  error: ErrorType;
  setError: (err: ErrorType) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}
