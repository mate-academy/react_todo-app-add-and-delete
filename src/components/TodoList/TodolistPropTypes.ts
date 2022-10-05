import { Todo } from '../../types/Todo';

export type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  loadingTodoId: number | null;
};
