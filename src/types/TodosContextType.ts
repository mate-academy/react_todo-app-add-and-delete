import { Status } from './Status';
import { Todo } from './Todo';

export interface TodosContextType {
  todos: Todo[];
  tempTodo: Todo | null,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: number) => void;
  clearCompletedTodos: () => void;
  filterStatus: Status,
  setFilterStatus: (status: Status) => void;
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  isSubmitting: boolean,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  deletedIds: Array<number>,
  setDeletedIds: React.Dispatch<React.SetStateAction<number[]>>,
}
