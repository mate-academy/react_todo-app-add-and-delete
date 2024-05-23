import { Todo } from '../../types/Todo';

export interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodos: number[];
}
