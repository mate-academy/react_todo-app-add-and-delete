import { Errors } from './Errors';
import { Status } from './Status';
import { Todo } from './Todo';

export type TodoContext = {
  visibleTodos: Todo[],
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  editedTodo: Todo | null,
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  error: Errors | null,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>,
  filterStatus: Status,
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  deletionId: number | null,
  setDeletionId: React.Dispatch<React.SetStateAction<number | null>>,
};
