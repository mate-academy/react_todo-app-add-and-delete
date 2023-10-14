import { Todo } from './Todo';
import { ErrorMessage } from './ErrorMessage';

export interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
  deleteCompletedTodos: () => void;
  incompletedTodosCount: number;
  hasCompletedTodos: boolean;
  filterTodos: (filterStatus: string) => Todo[];
  errorMessage: string;
  setErrorMessage: (value: ErrorMessage) => void;
  hideError: (DEFAULT: ErrorMessage.DEFAULT) => void;
  setIsProcessing: (value: [] | { (prev: number[]) : number[] }) => void;
}
