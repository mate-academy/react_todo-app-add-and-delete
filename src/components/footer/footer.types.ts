import { Statuses } from '../../types/Statuses';
import { Todo } from '../../types/Todo';

export type FooterTypes = {
  todos: Todo[];
  handleSelectTodo: (action: Statuses) => void;
  selectedStatus: Statuses;
  handleDeleteCompletedTodo: () => void;
  isHaveOneCompleted: boolean;
};
