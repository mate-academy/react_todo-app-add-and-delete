import { Status } from './Status';
import { Todo } from './Todo';

export type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  toggleAll: () => void;
  clearCompleted: () => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
  selectedStatus: Status;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Status>>
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  removeErrorIn3sec: () => void,
  notCompletedTodos: number,
  tempTodo: Todo | null,
  isSubmiting: boolean,
  setIsSubmiting: React.Dispatch<React.SetStateAction<boolean>>,
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  completedTodosIds: Array<number>,
  removingCompleted: boolean,
  setRemovingCompleted: React.Dispatch<React.SetStateAction<boolean>>,
};
