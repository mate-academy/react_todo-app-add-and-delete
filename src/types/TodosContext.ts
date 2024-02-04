import { Status } from './Status';
import { Todo } from './Todo';

export type TodoContext = {
  todos: Todo[]
  setTodos: (v: Todo[] | ((n: Todo[]) => Todo[])) => void
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  filterBy: Status;
  setFilterBy: (filterBy: Status) => void
  errorMessage: string
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  tempTodo: Todo | null
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  updatedTodos: Todo[]
  setUpdatedTodos: React.Dispatch<React.SetStateAction<Todo[]>>
};
