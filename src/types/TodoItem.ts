import { Todo } from './Todo';

export interface TodoItemProps {
  todo: Todo;
  handleTodoToggle: (todoId: number, completed: boolean) => void;
  handleTodoDelete: (todoId: number) => void;
  handleTodoUpdate: (todoId: number, newTitle: string) => void;
  isLoading: boolean;
}
