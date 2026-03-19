import { Todo } from '../types/Todo';

export interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  isDeleteDisabled?: boolean;
}
