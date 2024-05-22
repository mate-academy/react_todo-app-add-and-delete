import { Todo } from '../../types/Todo';

export interface TodoProps {
  todo: Todo;
  isTemp?: boolean;
  onTodoChange: (updatedTodo: Partial<Todo> & { id: number }) => void;
  onDeleteTodo: (deletedTodoId: number) => void;
  onError: (errorMessage: string) => void;
}
