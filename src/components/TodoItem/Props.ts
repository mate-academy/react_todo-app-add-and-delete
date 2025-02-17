import { Todo } from '../../types/Todo';

export interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
}
