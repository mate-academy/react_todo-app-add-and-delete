import { Status } from './Status';
import { Todo } from './Todo';

export type TodoContext = {
  todos: Todo[]
  setTodos: (v: Todo[] | ((n: Todo[]) => Todo[])) => void
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  filterField: Status;
  setFilterField: (filterField: Status) => void
  errorMessage: string
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  tempTodo: Todo | null
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  changedTodos: Todo[]
  setChangedTodos: React.Dispatch<React.SetStateAction<Todo[]>>
};
