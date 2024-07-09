import { Todo } from './Todo';
export interface TodoItemProps {
  todo: Todo;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  deletingCompleted: boolean;
}
