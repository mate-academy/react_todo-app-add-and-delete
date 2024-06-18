import { ErrorsEnum } from '../utils/ErrorsEnum';
import { Todo } from './Todo';

export interface TodoHeaderProps {
  inputValue: string;
  isEnabled: boolean;
  createTodo: () => void;
  setInputValue: (value: string) => void;
  toggleEnabled: (value: boolean) => void;
}

export interface TodoProps {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
}

export interface TodoListProps {
  todoList: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
}

export interface TodoFooterProps {
  todoList: Todo[];
  isClearDisabled: boolean;
  filterTodoList: (filteredTodos: Todo[]) => void;
  clearCompleted: () => void;
  updateClearDisabled: () => void;
}

export interface TodoFilterProps {
  todoList: Todo[];
  filterTodoList: (filteredTodos: Todo[]) => void;
  updateClearDisabled: () => void;
}

export interface ErrorProps {
  error: ErrorsEnum | null;
  clearError: (value: null) => void;
}
