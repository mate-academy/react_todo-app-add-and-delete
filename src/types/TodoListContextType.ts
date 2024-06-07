import { TodoType } from './TodoType';

export type TodoListContextType = {
  todos: TodoType[];
  errorMessage: string | null;
  tempTodo: TodoType | null;
  currentFilter: string;
  setCurrentFilter: (status: string) => void;
  addTodo: (todo: string) => void;
  deleteTodo: (id: number) => void;
  clearErrorMessage: () => void;
  clearCompletedTodo: () => void;
};
