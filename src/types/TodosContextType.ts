import { ErrorMessage } from './ErrorMessage';
import { FilterBy } from './FilterBy';
import { Todo } from './Todo';

export interface TodosContextType {
  USER_ID: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterBy: FilterBy,
  setFilterBy: (param: FilterBy) => void,
  errorMessage: ErrorMessage,
  addErrorMessage: (message: ErrorMessage) => void,
  todoLoader: number | null,
  setTodoLoader: (id: number | null) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
}
